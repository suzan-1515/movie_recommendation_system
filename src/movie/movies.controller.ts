import { JwtAuthGuard } from '@/user/auth/auth.guard';
import { User } from '@/user/user.entity';
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Inject, Optional, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiResponseProperty } from '@nestjs/swagger';
import { MovieReactionDto } from './dto/movie-reaction.dto';
import { UserReactionDto } from './dto/user-reaction.dto';
import { MoviesService } from './movies.service';
import { Request } from 'express';
import { MovieReactionRequestDto } from './dto/movie-reaction-request.dto';

// The MoviesController is the entry point for the movie endpoints.
// The @UseGuards() decorator is used to define the authentication guard for the endpoint. On this endpoint, the JwtAuthGuard is used.
/* The @UseInterceptors() decorator is used to define the interceptor for the endpoint. 
    - On this endpoint, the ClassSerializerInterceptor is used.
    - It maps the MovieReactionRequestDto class to the response body in JSON format.
*/
// @APiResponse decorator is for swagger documentation.
/* @Req() decorator is used to get the request object.
    - In this case, user is extracted from the request object.
    - User is appended to the request object by the JwtAuthGuard upon successful authentication.
*/
@Controller('movies')
export class MoviesController {

    // MovieService is injected into the MoviesController.
    constructor(private moviesService: MoviesService) { }

    // The @Post() decorator denotes the HTTP POST method for the endpoint.
    /* This endpoint like a movie for the requested user.
        - It deligates request to the MoviesService.
        - The @Body() decorator gets the request body data.
        - Body data is mapped to CreateGroupDto class and validated by pipe defined in main application configuration.
    */
    // User id property is updated to the id of current user.
    @UseGuards(JwtAuthGuard)
    @Post('/like')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async likeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {
        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.likeMovie(movieReactionDto);
    }

    // This endpoint unlike a movie for the requested user.
    @Post('/unlike')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async unlikeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {
        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.unlikeMovie(movieReactionDto);
    }

    // This endpoint dislike a movie for the requested user.
    @Post('/dislike')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async dislikeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {
        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.dislikeMovie(movieReactionDto);
    }

    // this endpoint removes a dislike reaction for a movie
    @Post('/undislike')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'The reaction has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async undislikeMovie(@Body() movieReactionDto: MovieReactionRequestDto, @Req() { user }: Request) {

        movieReactionDto.userId = (<User>user).id.toString();
        return this.moviesService.unDislikeMovie(movieReactionDto);
    }

    // This endpoint returns recommended movies for the requested user. Quantity of recommended movies is defined by the query parameter. 
    // Default quantity is 10.
    @Get('/recommend')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of moviesId',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async recommendMovie(@Query('numberOfRecs') numberOfRecs: number = 10, @Req() { user }: Request) {
        if(!numberOfRecs) numberOfRecs=10;
        const movies = await this.moviesService.recommendMovie((<User>user).id.toString(), numberOfRecs);
        return {
            'results': movies,
        }
    }

    // This enpoint is for getting similar users.
    @Get('/similar-users')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of usersId',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async similarUsers(@Req() { user }: Request) {
        return this.moviesService.similarUsers((<User>user).id.toString());
    }

    // This endpoint returns best rated movies. Rating is calculated by the average of the ratings of the users who liked the movie.
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

    // This endpoint returns worst rated movies. Rating is calculated by the average of the ratings of the users who disliked the movie.
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

    // This endpoint returns the most liked movies.
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

    // This endpoint returns the users who liked the requested movie. Movie id is passed as a path parameter.
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

    // This endpoint returns total like count for the requested movie. Movie id is passed as a path parameter.
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

    // This endpoint returns total dislike count for the requested movie. Movie id is passed as a path parameter.
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

    // This endpoint return movies liked by current user.
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

    // This endpoint return movies disliked by current user.
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

    // This endpoint return all watched movies by current user. This is based on like and dislike reactions.
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

    // This endpoint return random movies for the current user based on genre preferences.
    @Get('/random')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'List of random movies',
        type: MovieReactionDto, isArray: true,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async randomMovies(@Query('genresId') genresId: string, @Query('page') page:number) {
        return this.moviesService.getRandomMovies(genresId,page);
    }

}

