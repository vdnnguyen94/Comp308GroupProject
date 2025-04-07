```
To run all your services at once, simply execute the following command in your terminal:
npm run start:all
npm run start:test 
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

```
I and Seyeon Jo will try our best to complete Resident User role (Can post local news, join discussions, and view community insights.). We will  create new models, graphql query and mutations. REPLACING student-microservice on PORT 3001. We may need extra help for AI part
[For Residents:]
1. Local News & Discussions:
- Users can post local updates, news, and discuss topics.
- AI-generated topic summarization for long discussions.
2. Neighborhood Help Requests:
- Residents can post help requests (e.g., "Need a pet sitter for the weekend").
- AI matches volunteers based on their interests and location.
3. Emergency Alerts:
- Residents can report urgent issues (e.g., missing pets, safety alerts).
- Real-time notifications sent to nearby users.

Gang Liu Na Zhang will do the Business Owner user role (Can list their business, post deals, and respond to reviews). REPLACING THE VITAL SIGN MICROSERVICE ON PORT 3002
[For Business Owners:]
1. Business Listings & Deals:
- Create business profiles with descriptions, images, and offers.
- Promote special deals to the local community.
2. Customer Engagement & Reviews:
- Business owners can respond to customer reviews.
- AI-powered sentiment analysis on reviews to provide business feedback.

Zack Feng will do the  Community Organizer: Can create and manage events and group activities. REPLACING product-microservice on port 3003
[For Community Organizers:]
1. Event Management System:
- Create and promote events (e.g., workshops, meetups, clean-up drives).
- AI predicts the best event timing based on local engagement patterns.
2. Volunteer Matching:
- AI suggests volunteers based on interests and previous event participation.
```