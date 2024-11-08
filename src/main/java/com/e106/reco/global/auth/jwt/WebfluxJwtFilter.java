package com.e106.reco.global.auth.jwt;

import com.e106.reco.domain.artist.user.dto.CustomUserDetails;
import com.e106.reco.global.error.exception.BusinessException;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.e106.reco.global.error.errorcode.AuthErrorCode.TOKEN_EXPIRED;
import static com.e106.reco.global.error.errorcode.AuthErrorCode.TOKEN_NOT_EXIST;

@Slf4j
@Builder
@RequiredArgsConstructor
@Component
public class WebfluxJwtFilter implements WebFilter {
    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String accessToken = request.getHeaders().getFirst("Authorization");


        // 토큰이 없다면 다음 필터로 넘김
        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        String token = accessToken.split(" ")[1];
        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {
            exchange.getResponse().setStatusCode(HttpStatusCode.valueOf(HttpServletResponse.SC_UNAUTHORIZED));
            throw new BusinessException(TOKEN_EXPIRED);
        }

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        if (!jwtUtil.getCategory(token).equals("access")) {
            //response body
            throw new BusinessException(TOKEN_NOT_EXIST);
        }

        Authentication authToken = createAuthentication(token);
        SecurityContextHolder.getContext().setAuthentication(authToken);

        return chain.filter(exchange);
    }

    private Authentication createAuthentication(String token) {
        List<Long> crews = new ArrayList<>();
        if(jwtUtil.getCrews(token).length()== 1) crews.add(Long.parseLong(jwtUtil.getCrews(token)));
        else if(jwtUtil.getCrews(token).length()>1)
            crews = Arrays.stream(jwtUtil.getCrews(token).split(" "))
                    .map(Long::parseLong)
                    .toList();

        CustomUserDetails customUserDetails = CustomUserDetails.builder()
                .seq(jwtUtil.getSeq(token))
                .nickname(jwtUtil.getNickname(token))
                .email(jwtUtil.getEmail(token))
                .genre(jwtUtil.getGenre(token))
                .gender(jwtUtil.getGender(token))
                .year(jwtUtil.getYear(token))
                .region(jwtUtil.getRegion(token))
                .position(jwtUtil.getPosition(token))
                .crews(crews)
                .role(null)
                .build();

        return new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
    }

}
