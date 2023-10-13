const generateId = () => {
  const random = Math.random().toString(32).substring(2);
  const dat = Date.now().toString(32);
  return random + dat;
};

export default generateId;
