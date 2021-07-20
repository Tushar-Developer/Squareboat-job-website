export const server = "http://localhost:5000";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
};

export default apiList;
