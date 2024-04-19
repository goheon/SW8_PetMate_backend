import jwt from 'jsonwebtoken';

export const tokenAuthenticated = (req, res, next) => {
  //쿠키에서 토큰 가져옴
  const token = req.cookies.jwt;

  if (token === undefined) {
    return res.status(401).send('인증되지 않은 요청입니다. 로그인이 필요합니다.');
  }
  //토큰 유효한지 확인(verify)
  const key = process.env.SECRET_KEY;
  jwt.verify(token, key, (err, user) => {
    if (err) {
      return res.send('유효하지 않은 토큰입니다.');
    }
    req.user = user;
    req.userId = req.user.userId;
    next();
  });
};
