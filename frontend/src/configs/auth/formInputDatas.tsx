// 회원가입할 때 필요한 데이터
export interface SignupFormData {
    userId: string;
    confirmNumber?: string;
    password: string;
    confirmPassword?: string;
    userName?: string;
    nickname?: string;
    gender?: string;
    birthday?: string;
    region?: string;
    position?: string;
    genre?: string;
    phoneNumber?: string;
    profileImage?: File | string | null;
  }

  export interface SignupInputField {
    label: string;
    type: string;
    name: string;
    options?: string[];
  }
  // 회원가입할 때 필요한 데이터
  export const SignupInputFields: SignupInputField[] = [
    { label: '아이디', type: 'email', name: 'userId' },
    { label: '인증 번호 입력', type: 'text', name: 'confirmNumber' },
    { label: '비밀번호', type: 'text', name: 'password' },
    { label: '비밀번호 확인', type: 'text', name: 'confirmPassword' },
    { label: '이름', type: 'text', name: 'userName' },
    { label: '별명', type: 'text', name: 'nickname' },
    { label: '성별', type: 'select', name: 'gender', options: ['남성', '여성', '기타'] },
    { label: '생년월일', type: 'date', name: 'birthday' },
    { label: '지역', type: 'select', name: 'region', options: ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '제주', '경기도 남부', '경기도 북부', '강원도 남부', '강원도 북부', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도'] },
    { label: '포지션', type: 'select', name: 'position', options: ['보컬', '베이스', '드럼', '일렉트릭기타', '어쿠스틱기타', '건반', '관악기', '현악기', '키보드'] },
    { label: '장르', type: 'select', name: 'genre', options: ['락', '발라드', '인디', '댄스', '클래식', '재즈', '오케스트라', '랩', '기타'] },
    { label: '전화번호', type: 'text', name: 'phoneNumber' },
    { label: '프로필 사진', type: 'file', name: 'profileImage' },
  ];

// 로그인할 때 필요한 데이터
export interface SigninFormData {
    userId: string;
    password: string;
  }

  export interface SigninInputField {
    label: string;
    type: string;
    name: string;
    options?: string[];
  }
  // 회원가입할 때 필요한 데이터
  export const SigninInputFields: SigninInputField[] = [
    { label: '아이디', type: 'email', name: 'userId' },
    { label: '비밀번호', type: 'text', name: 'password' },
  ];