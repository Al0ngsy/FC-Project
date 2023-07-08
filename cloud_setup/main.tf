provider "google" {
  credentials = file("gcp_account.json")
  project     = "fc-projekt"
  region      = "europe-west1"
}

resource "google_compute_instance" "default" {
  name         = "server-vm"
  machine_type = "e2-small"
  zone         = "europe-west1-b"

  boot_disk {
    initialize_params {
      image = "projects/cos-cloud/global/images/family/cos-stable"
    }
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral IP
    }
  }
#  metadata = {
#    gce-container-declaration = <<EOF
#spec:
#  containers:
#  - name: server
#    image: zero85/fog_project:server
#    ports:
#    - containerPort: "5559"
#      hostPort: 80
#      protocol: TCP
#EOF
#    google-logging-enabled = "false"
#  }

 metadata_startup_script = <<SCRIPT
 #! /bin/bash
 docker run -d -p 80:5559 "zero85/fog_project:server"
 SCRIPT
  service_account {
    scopes = ["userinfo-email", "compute-ro", "storage-ro"]
  }
   tags = ["http-server"]
}

output "ip_address" {
  value = google_compute_instance.default.network_interface[0].access_config[0].nat_ip
  description = "The external IP address of the VM instance."
}