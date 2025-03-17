```
To run all your services at once, simply execute the following command in your terminal:
npm run start:all
in the server folder.

Then, run the user-app micro frontend using: npm run deploy

And finally, run the shell-app using: npm run dev
```

```
Port 3000 for gateways
Port 3001-3005 for microservices
Port 3010-3015 for microfrontends
```

```
microfrontend to shell app
3 keys files: 
- package.json for Port
- vite.config for expose file and remotes access
- App.jsx of Shell, how to intergrate the component
```