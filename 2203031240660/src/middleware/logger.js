export const logAction = (action, payload = {}) => {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, action, ...payload };
  let logs = JSON.parse(localStorage.getItem('logs')) || [];
  logs.push(entry);
  localStorage.setItem('logs', JSON.stringify(logs));
};
