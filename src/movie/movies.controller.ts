import { JwtAuthGuard } from '@/user/auth/auth.guard';
import { User } from '@/user/user.entity';
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Inject, Optional, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { MovieReactionDto } from './dto/movie-reaction.dto';
import { UserReactionDto } from './dto/user-reaction.dto';
import { MoviesService } from './movies.service';
import { Request } from 'express';
import { MovieReactionRequestDto } from './dto/movie-reaction-request.dto';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/like')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async likeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {
        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.likeMovie(movieReactionDto);
    }

    @Post('/unlike')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async unlikeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {

        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.unlikeMovie(movieReactionDto);
    }

    @Post('/dislike')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async dislikeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {

        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.dislikeMovie(movieReactionDto);
    }

    @Post('/undislike')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async undislikeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {

        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.unDislikeMovie(movieReactionDto);
    }

    @Get('/recommend')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async recommendMovie(@Query('numberOfRecs') @Optional() numberOfRecs: number = 10, @Req() { user }: Request) {
        return this.moviesService.recommendMovie((<User>user).id.toString(), numberOfRecs);
    }

    @Get('/similar-users')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of usersId',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async similarUsers(@Req() { user }: Request) {
        return this.moviesService.similarUsers((<User>user).id.toString());
    }

    @Get('/best-rated')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async bestRatedMovies() {
        return this.moviesService.bestRatedMovies();
    }

    @Get('/worst-rated')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async worstRatedMovies() {
        return this.moviesService.worstRatedMovies();
    }

    @Get('/most-liked')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async mostLikedMovies() {
        return this.moviesService.mostLikedMovies();
    }

    @Get('/likers/:movieId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of usersId',
        type: UserReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async movieLikers(@Param('movieId') movieId: string) {
        return this.moviesService.movieLikers(movieId);
    }

    @Get('/liked-count/:movieId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Number of like count',
        type: Number,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async likedMovieCount(@Param('movieId') userId: string) {
        return this.moviesService.likedMovieCount(userId);
    }

    @Get('/disliked-count/:movieId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Number of dislike count',
        type: Number,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async dislikedMovieCount(@Param('movieId') userId: string) {
        return this.moviesService.disLikedMovieCount(userId);
    }

    // User liked movies
    @Get('/liked')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async likedMovies(@Req() { user }: Request) {
        return this.moviesService.likedMovies((<User>user).id.toString());
    }

    @Get('/disiked')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async dislikedMovies(@Req() { user }: Request) {

        return this.moviesService.disLikedMovies((<User>user).id.toString());
    }

    @Get('/watched')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async watchedMovies(@Req() { user }: Request) {
        return this.moviesService.watchedMovies((<User>user).id.toString());
    }

    @Get('/random')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of random movies',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async randomMovies(@Query('genresId') genresId: string) {
        return this.moviesService.getRandomMovies(genresId);
    }

}

