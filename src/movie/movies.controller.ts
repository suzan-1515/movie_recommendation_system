import { Body, Controller, Get, Inject, Optional, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { MovieReactionRequestDto } from './dto/movie-reaction-request.dto';
import { MovieReactionDto } from './dto/movie-reaction.dto';
import { UserReactionDto } from './dto/user-reaction.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) { }

    @Post('/like')
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async likeMovie(@Body() movieReactionRequestDto: MovieReactionRequestDto) {
        return this.moviesService.likeMovie(movieReactionRequestDto);
    }

    @Post('/unlike')
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async unlikeMovie(@Body() movieReactionRequestDto: MovieReactionRequestDto) {
        return this.moviesService.unlikeMovie(movieReactionRequestDto);
    }

    @Post('/dislike')
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async dislikeMovie(@Body() movieReactionRequestDto: MovieReactionRequestDto) {
        return this.moviesService.dislikeMovie(movieReactionRequestDto);
    }

    @Post('/undislike')
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async undislikeMovie(@Body() movieReactionRequestDto: MovieReactionRequestDto) {
        return this.moviesService.unDislikeMovie(movieReactionRequestDto);
    }

    @Get('/recommend/:userId')
    @ApiOkResponse({ 
        description: 'List of moviesId', 
        type: MovieReactionDto, isArray: true, 
    })
    async recommendMovie(@Param('userId') userId: string, @Query('numberOfRecs') @Optional() numberOfRecs: number = 10) {
        return this.moviesService.recommendMovie(userId, numberOfRecs);
    }


    @Get('/similar-users/:userId')
    @ApiOkResponse({ 
        description: 'List of usersId', 
        type: UserReactionDto, isArray: true, 
    })
    async similarUsers(@Param('userId') userId: string) {
        return this.moviesService.similarUsers(userId);
    }

    @Get('/best-rated')
    @ApiOkResponse({ 
        description: 'List of moviesId', 
        type: MovieReactionDto, isArray: true, 
    })
    async bestRatedMovies() {
        return this.moviesService.bestRatedMovies();
    }

    @Get('/worst-rated')
    @ApiOkResponse({ 
        description: 'List of moviesId', 
        type: MovieReactionDto, isArray: true, 
    })
    async worstRatedMovies() {
        return this.moviesService.worstRatedMovies();
    }

    @Get('/most-liked')
    @ApiOkResponse({ 
        description: 'List of moviesId', 
        type: MovieReactionDto, isArray: true, 
    })
    async mostLikedMovies() {
        return this.moviesService.mostLikedMovies();
    }

    @Get('/likers/:movieId')
    @ApiOkResponse({ 
        description: 'List of usersId', 
        type: UserReactionDto, isArray: true, 
    })
    async movieLikers(@Param('movieId') movieId: string) {
        return this.moviesService.movieLikers(movieId);
    }

    @Get('/liked-count/:movieId')
    @ApiOkResponse({ 
        description: 'Number of like count',
        type: Number, 
    })
    async likedMovieCount(@Param('movieId') userId: string) {
        return this.moviesService.likedMovieCount(userId);
    }

    @Get('/disliked-count/:movieId')
    @ApiOkResponse({ 
        description: 'Number of dislike count', 
        type: Number,
    })
    async dislikedMovieCount(@Param('movieId') userId: string) {
        return this.moviesService.disLikedMovieCount(userId);
    }

    // User liked movies
    @Get('/liked/:userId')
    @ApiOkResponse({ 
        description: 'List of moviesId', 
        type: MovieReactionDto, isArray: true, 
    })
    async likedMovies(@Param('userId') userId: string) {
        return this.moviesService.likedMovies(userId);
    }

    @Get('/disiked/:userId')
    @ApiOkResponse({ 
        description: 'List of moviesId', 
        type: MovieReactionDto, isArray: true, 
    })
    async dislikedMovies(@Param('userId') userId: string) {
        return this.moviesService.disLikedMovies(userId);
    }

    @Get('/watched/:userId')
    @ApiOkResponse({ 
        description: 'List of moviesId', 
        type: MovieReactionDto, isArray: true, 
    })
    async watchedMovies(@Param('userId') userId: string) {
        return this.moviesService.watchedMovies(userId);
    }

}

