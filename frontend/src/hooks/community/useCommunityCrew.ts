import React, { useState, useEffect } from "react";

const UseCommunityCrew = () => {
    const [ isCrewFollow, setIsCrewFollow ] = useState<boolean>(false);
    const [ isjoinCrew, setIsJoinCrew ] = useState<boolean>(false);
    const [ withdrawCrew, setWithDrawCrew ] = useState<boolean>(false);
    const [ openCrewFollowModal, setopenCrewFollowModal ] = useState<boolean>(false);
    const [ openCrewJoinModal, setopenCrewJoinModal ] = useState<boolean>(false);
    const [ openCrewWithdrawModal, setopenCrewWithdrawModal ] = useState<boolean>(false);
    const [ openCrewMembersModal, setOpenCrewMembersModal ] = useState<boolean>(false);

    const goCrewFollow = () => {
        console.log('된다')
        setIsCrewFollow((prev) => !prev);
        // 팔로우 요청 api 연결
    };
    
    const goJoinCrew = () => {
        setIsJoinCrew((prev) => !prev);
        // 크루 가입 요청 api 연결
    };
    
    const goWithdrawCrew = () => {
        setWithDrawCrew((prev) => !prev);
    };
    
    const handleCrewFollowModal = () => {
        console.log('열었다')
        setopenCrewFollowModal((prev) => !prev)
    };

    const handleCrewJoinModal = () => {
        setopenCrewJoinModal((prev) => !prev)
    };

    const handleCrewWithdrawModal = () => {
        setopenCrewWithdrawModal((prev) => !prev)
    };

    const handleCrewMembers = () => {
        setOpenCrewMembersModal((prev) => !prev);
    }
    
    useEffect(() => {
        console.log('openmembermodal', openCrewMembersModal)

    }, [openCrewMembersModal])
    

    return {
        isCrewFollow,
        isjoinCrew,
        withdrawCrew,
        openCrewFollowModal,
        openCrewJoinModal,
        openCrewWithdrawModal,
        openCrewMembersModal,
        goCrewFollow,
        goJoinCrew,
        goWithdrawCrew,
        setopenCrewFollowModal,
        setopenCrewJoinModal,
        setopenCrewWithdrawModal,
        handleCrewFollowModal,
        handleCrewJoinModal,
        handleCrewWithdrawModal,
        handleCrewMembers,
    }
}

export default UseCommunityCrew;