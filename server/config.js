const config = {
    env: process.env.NODE_ENV || 'development',
    jwtSecret: "CommunityProject",
    mongoUri: "mongodb+srv://vdnnguyen94:SurveyApp@surveyapp.1fgijrv.mongodb.net/SchoolSystem?retryWrites=true&w=majority"
  };
  
module.exports = config;