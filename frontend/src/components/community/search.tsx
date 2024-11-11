import React from 'react';
import { Text, Box, Input, Stack, Button } from '@chakra-ui/react';
import useCommunityMain from '@/hooks/community/useCommunityMain';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    // handleChangeSearch: (event: React.FormEvent) => void; 
}

const Search: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const {
        searchInput,
        handleChangeSearch,
        setSearchInput
    } = useCommunityMain();
    

    const overlayStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    };
    
    const contentStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "30px",
    textAlign: "center",
    width: "600px",
    maxWidth: "800px",
    height: "600px",
    maxHeight: "1200px",
    position: "relative",
    };
    
    const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "30px",
    right: "30px",
    background: "none",
    border: "none",
    color: "black",
    fontSize: "24px",
    cursor: "pointer",
    };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
            <button style={closeButtonStyle} onClick={onClose}>
                X
            </button>
            <Box padding=" 5px 20px">
                <Text color="black" margin="40px">검색</Text>
                <Stack gap="4">
                    <form onSubmit={handleChangeSearch}>
                        <Box display="flex" flexDirection="row" gap="5px">
                            <Input 
                                placeholder="찾으시는 유저 혹은 크쿠를 입력해주세요." 
                                variant="subtle" 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Button type="submit">검색</Button>
                        </Box>
                    </form>
                </Stack>
            </Box>   
        </div>
    </div>
  );
};

export default Search;
