# FC-Project

TUB - FC Prototyping Assignment SS 2023

Using yarn (https://yarnpkg.com/) as package manager.

Require node (https://nodejs.org/en) >= 14.17

- Tested on node 18.16.0

## For local testing:

On 2 separate terminal:

```
cd cloud-server
yarn -- first time only
yarn start
```

```
cd edge-server
yarn -- first time only
yarn start
```

Example on 'how to pass cmd line variable':

```
> PORT=6969 yarn start
```

the variable can be accessed with process.env.PORT. Best to pass it to config in config.ts where we can define default value and access it via imported config in other ts/js files.

## How to deploy on docker

```
cd cloud-sever -- or edge-server
yarn compile -- compile the code to js
yarn docker -- run commands in DockerFile
docker run -d -p 5559 cserver -- or 'eserver' for edge-server
```

docker run:
-p or --publish: This option is used to publish container ports to the host. It allows you to map a port on the Docker host to a port in the container. The syntax is -p hostPort:containerPort. With this option, you can access the containerized service from your local machine using the specified port on the Docker host.


## Example on GCP

Download your gcp service account json [link](https://cloud.google.com/iam/docs/keys-create-delete?hl=de) and put it in a gcp_account.json named file next to the main.tf.

```
terraform init # just for the first time
terraform apply
```
The server starts up automatically and the ip is outputted at the terminal.
After that start your local edge container:
```
docker run -p 5559:5559 -e "SERVER_URL=http://<server-ip>" zero85/fog_project:edge
```

Insert server ip in the SERVER_URL environment variable for the edge-server and start the edge-server and see the data flowing.
