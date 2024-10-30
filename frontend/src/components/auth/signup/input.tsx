import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupFormData, SignupInputFields } from '@/configs/auth/formInputDatas';
import { Button } from '@chakra-ui/react';
import paths from '@/configs/paths';
import axios from 'axios';

const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
const phoneRule = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

const Input: React.FC = () => {
    const navigate = useNavigate();

    const [ notices, setNotices ] = useState<Record<string, string>>({});
    const [ verifyBtn, setVerifyBtn ] = useState<boolean>(false);
    const [ verifyNumber, setVertifyNumber ] = useState<boolean>(false);
    const [ submitSignup, setSubmitSignup ] = useState<boolean>(false)
    const [ previewImage, setPreviewImage ] = useState<string | null>(null);

    const [ formData, setFormData ] = useState<SignupFormData>({
        userId: '',
        confirmNumber: '',
        password: '',
        confirmPassword: '',
        userName: '',
        nickname: '',
        gender: '',
        birthday: '',
        region: '',
        position: '',
        genre: '',
        phoneNumber: '',
        profileImage: '/profileImage.png'
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === 'profileImage' && files) {
            const file = files[0];
            setFormData((prevFormData) => ({...prevFormData, profileImage: file}));
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, [name]: value}));

            if (name === 'userId') {
                setVerifyBtn(exptext.test(value));
            }
        }
        
        setNotices((prevNotices) => ({
            ...prevNotices,
            [name]: ''
        }));
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let noticeMessage = '';
        
        if (name === 'userId') {
            if (!exptext.test(value)) {
                noticeMessage = '올바른 이메일 형식을 입력해주세요.'
            } else {
                setVerifyBtn(true)
            }
        } else if (name === 'password' && (value.length < 8 || 16 < value.length)) {
            noticeMessage = '비밀번호는 8-16글자 사이로 입력해주세요.'
        } else if (name === 'confirmPassword') {
            if (value !== formData.password) {
                noticeMessage = '비밀번호가 일치하지 않습니다.'
            } else {
                noticeMessage = '비밀번호가 일치합니다.'
            }
        } else if (name === 'userName') {
            if (2 <= value.length && value.length <= 10) {
                noticeMessage = '확인되었습니다.'
            } else {
                noticeMessage = '다시 한 번 확인해주세요.'
            }
        } else if (name === 'nickname') {
            if (1 <= value.length && value.length <= 20) {
                noticeMessage = '확인되었습니다.'
            } else {
                noticeMessage = '다시 한 번 확인해주세요.'
            }
        } else if (name === 'phoneNumber' && !phoneRule.test(value)) {
            noticeMessage = '올바른 번호 형식을 입력해주세요.'
        }
        
        setNotices ((prevNotices) => ({
            ...prevNotices,
            [name]: noticeMessage
        }));
    };

    const sendVerifyNumber = async () => {
        // 인증 이메일 전송하는 코드
        // try {
        //     const response = await axios.post(
        //         // URL 고치기
        //         `${API_URL}/api/auth/email`, 
        //         {'email' : formData.userId}
        //     )
        //     console.log(response.data)
        // } catch(error) {
        //     console.error(error)
        // }
        setVertifyNumber(true);
    };

    const checkverifyNumber = async () => {
        // 인증 번호가 맞는지 확인하는 코드
                // try {
        //     const response = await axios.post(
        //         // URL 고치기
        //         `${API_URL}/api/auth/email/code`, 
        //         {
                    //     'email' : formData.userId,
                            // 'code' : formData.confirmNumber
                    // }
        //     )
        //     console.log(response.data)
            setSubmitSignup(true)
        // } catch(error) {
        //     console.error(error)
        // }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSubmit.append(key, value instanceof File ? value : String(value));
        })
        let newGender = '';

        if (formData.gender === '남성') {
            newGender = 'M'
        } else if (formData.gender === '여성') {
            newGender = 'F'
        } else {
            newGender = 'E'
        }
        // 백한테 회원가입 정보 보내기
        // try {
        //     const response = await axios.post(
        //         // URL 고치기
        //         `${API_URL}/api/auth/join`,
        //         {
        //             "email" : formData.userId,
        //             "password" : formData.password,
        //             "name" : formData.userName,
        //             "nickname" : formData.gender,
        //             "gender" : newGender,
        //             "birth" : formData.birthday,
        //             "region" : formData.region,
        //             "position" :formData.position,
        //             "genre" : formData.genre,
        //             "profileImage" : formData.profileImage
        //         }
        //     );
            //    navigate(paths.main)
        //     console.log(response.data)
        // } catch(error) {
        //     console.error(error)
        // }
    };

    

    return (
        <div>
        <form onSubmit={handleSubmit}>
            {SignupInputFields.map((field, index) => (
                <div key={index}>
                    <label>{field.label}</label>
                    {field.type === 'select' ? (
                        <select
                            name={field.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={field.name !== 'profileImage' ? (formData[field.name as keyof SignupFormData] as string || '') : undefined}
                            style={{ color: 'black' }}
                            >
                            <option 
                                value=''
                                style={{ color: 'black' }}
                            >선택</option>
                            {field.options?.map((option, idx) => (
                                <option
                                    key={idx}
                                    value={option}
                                    style={{ color: 'black' }}
                                >
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                        type={field.type}
                        name={field.name}
                        value={field.name !== 'profileImage' ? (formData[field.name as keyof SignupFormData] as string || '') : undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field.name === 'userId' ? 'abc@abc.com' : field.name === 'phoneNumber' ? '010-0000-0000' : ''}
                        accept={field.type === 'file' ? 'image/*' : undefined}
                        style={{color: 'black'}}
                        ></input>
                    )}
                                        {notices[field.name] && <div style={{ color: 'red' }}>{notices[field.name]}</div>}
                    {field.name === 'userId' ? <Button onClick={sendVerifyNumber} disabled={!verifyBtn}>인증 번호 전송</Button> : null}
                    {field.name === 'confirmNumber' && verifyNumber ? <Button onClick={checkverifyNumber}>인증</Button> : null}
                    {field.name === 'confirmNumber' && submitSignup ? '인증되었습니다.': null}
                </div>
            ))}
            {submitSignup ? <Button type='submit'>회원가입</Button> : ''}
        </form>
        </div>
    );
    };

export default Input;