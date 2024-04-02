import React, { useState } from 'react';
import Header from '../components/Header';
import './signUp.scss';
import Footer from '../components/Footer';
import AddressAPI from '../components/AddressAPI';

function SignUp() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header />
      <section className="sing-up">
        <div className="sing-up_inner">
          <h3>펫메이트에 오신 것을 환영합니다</h3>

          <div className="sing-up_wrap">
            <form action="http://localhost:3000/api/v1/auth/sign-up" method="post">
              <div className="name-wrap">
                <p>
                  이름
                  <i className="fa-regular fa-circle-check"></i>
                </p>
                <input className="sing-up_name" type="text" name="name" />
              </div>

              <div className="email-wrap email-wrap-01">
                <p>
                  이메일
                  <i className="fa-regular fa-circle-check"></i>
                </p>
                <input className="sing-up_email-01" type="email" name="email" placeholder="예) kream@kream.co.kr" />
              </div>

              <div className="password-wrap">
                <p>
                  비밀번호
                  <i className="fa-regular fa-circle-check"></i>
                </p>
                <input className="sing-up_password-01" type="password" name="password" maxLength="16" />
                <p className="input_error">영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)</p>
              </div>

              <div className="address-wrap">
                <p>
                  주소
                  <i className="fa-regular fa-circle-check"></i>
                </p>
                <input
                  id="sing-up_postcode"
                  className="sing-up_postcode"
                  type="text"
                  name="sing-up_postcode"
                  placeholder="우편번호"
                />
                <button className="ja_find">우편번호 찾기</button>
                <input id="sing-up_address" className="sing-up_address" type="text" name="address" placeholder="주소" />
              </div>

              <div className="address-wrap-2">
                <p>
                  상세주소
                  <i className="fa-regular fa-circle-check"></i>
                </p>
                <input
                  className="sing-up_detailAddress"
                  type="text"
                  name="addressDetail"
                  placeholder="상세주소"
                  id="sing-up_detailAddress"
                />
              </div>

              <input className="sing-up_submit" type="submit" value="회원가입" />
            </form>
          </div>
        </div>
      </section>
      <AddressAPI />
      <Footer />
    </>
  );
}

export default SignUp;
