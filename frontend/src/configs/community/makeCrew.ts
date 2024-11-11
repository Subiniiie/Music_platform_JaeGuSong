// 크루를 만들 때 필요한 데이터
export interface MakeCrewFormData {
  birth?: string;
  nickname?: string;
  region?: string;
  genre?: string;
  content?: string;
  profileImage: File | null;
}

export interface MakeCrewInputField {
    label: string;
    type: string;
    name: string;
    options?: string[];
};

export const MakeCrewInputFields: MakeCrewInputField[] = [
    {label: '크루명', type: 'text', name: 'crewNickname'},
    {label: '크루 설명', type: 'textarea', name: 'content'},
    { label: '지역', type: 'select', name: 'region', options: ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '제주', '경기도 남부', '경기도 북부', '강원도 남부', '강원도 북부', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도'] },
    { label: '장르', type: 'select', name: 'genre', options: ['락', '발라드', '인디', '댄스', '클래식', '재즈', '오케스트라', '랩', '기타'] },
]