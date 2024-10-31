package com.e106.reco.domain.artist.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@Getter
@Builder
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails{
    private final Long seq;
    private final String email;
    private final String nickname;
    private final String password;
    private final String role;

    //roll 반환하는 것
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return role;
            }
        });
        return collection;
    }

//    public UserRole getRole() { return role; }

    public String getNickname() {
        return nickname;
    }

    public Long getSeq() { return seq; }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() { return email;}

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
