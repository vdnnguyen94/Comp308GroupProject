```
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserComponent from './UserComponent';
import StudentList from './StudentList';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<UserComponent />} /> */}
        {/* <Route path="/students" element={<StudentList />} /> */}
        <UserComponent />
        <StudentList />
      </Routes>
    </Router>
  );
};

export default App;
```

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