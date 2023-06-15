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
or
yarn dev
```

```
cd edge-server
yarn -- first time only
yarn start
or
yarn dev
```

Example on 'how to pass cmd line variable':

```
> PORT=6969 yarn start
```

the variable can be accessed with process.env.PORT. Best to pass it to config in config.ts where we can define default value and access it via imported config in other ts/js files.
