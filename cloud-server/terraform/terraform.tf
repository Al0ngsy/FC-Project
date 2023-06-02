// Google Cloud Provider Konfiguration
provider "google" {
  // Pfad zur JSON-Schlüsseldatei des Service-Accounts
  credentials = file("cloud-server\terraform\terraform.tf")
  // Die Projekt-ID, unter der die Ressourcen erstellt werden
  project     = "fc-projekt"
  // Die Region, in der die Ressourcen erstellt werden
  region      = "europe-north1"
}

// Ressource für die VM-Instanz
resource "google_compute_instance" "default" {
  // Name der VM-Instanz
  name         = "cloud-endpoint"
  // Maschinentyp der VM-Instanz
  machine_type = "f1-micro"
  // Zone, in der die VM-Instanz erstellt wird
  zone         = "europe-north1-c"

  // Konfiguration der Boot-Disk
  boot_disk {
    initialize_params {
      // Image, das für die Boot-Disk verwendet wird
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
    }
  }

  // Netzwerkschnittstellen-Konfiguration
  network_interface {
    // Name des Netzwerks
    network = "default"

    // Zugriffskonfiguration (für öffentliche IP)
    access_config {
      // Ephemeral IP
    }
  }

  // Service-Account-Konfiguration
  service_account {
    // Berechtigungen, die dem Service-Account gewährt werden
    scopes = ["userinfo-email", "compute-ro", "storage-ro"]
  }
}

// Ausgabe der öffentlichen IP-Adresse der VM-Instanz
output "instance_public_ip" {
  description = "Die öffentliche IP der erstellten Instanz"
  value       = google_compute_instance.default.network_interface[0].access_config[0].nat_ip
}
