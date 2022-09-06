import { Inject, Injectable } from '@nestjs/common';
import Raccoon from '@maruware/raccoon';
import { MovieReactionRequestDto } from './dto/movie-reaction-request.dto';
import { TheMovieDbService } from '@harshppatel/nestjs-themoviedb-api/dist/src';
import * as MovieDB from 'node-themoviedb';

// Movies service handles the business logic for the movie feature.
// It is injected into the MoviesController.
@Injectable()
export class MoviesService {

    // Inject the raccoon instance and TMBD api service into the service.
    constructor(@Inject('RACCOON') private raccoon: Raccoon, private readonly theMovieDbService: TheMovieDbService) { }

    // Like a movie with userId and movieId from the request. Recommendation engile raccoon provides the like method.
    // once the movie is liked, it is added to the user's liked list in radis and processed by the recommendation engine.
    async likeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} liked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.liked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    async unlikeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} unliked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.unliked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    async dislikeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} disliked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.disliked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    async unDislikeMovie(movieReactionRequestDto: MovieReactionRequestDto): Promise<void> {
        console.log(`User ${movieReactionRequestDto.userId} unDisliked movie ${movieReactionRequestDto.movieId}`);
        return this.raccoon.undisliked(movieReactionRequestDto.userId, movieReactionRequestDto.movieId);
    }

    /* Get the recommended movies for the user.
        - The recommendation engine raccoon provides the recommendFor method that takes user id and number of movies to recommend.
        - Since the engine returns the movie ids, we need to get the movie details from the TMDB api.
        - For that, we use the getMoviesDetail method that takes the movie ids and returns the movie details.
    */
    async recommendMovie(userId: string, numberOfRecs = 10): Promise<any> {
        console.log(`User ${userId} recommended ${numberOfRecs} movies`);
        const moviesId = await this.raccoon.recommendFor(userId, numberOfRecs);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async similarUsers(userId: string): Promise<string[]> {
        console.log(`User ${userId} similar users`);
        return this.raccoon.mostSimilarUsers(userId);
    }

    async bestRatedMovies(): Promise<any> {
        console.log(`Best rated movies`);
        const moviesId = await this.raccoon.bestRated();
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async worstRatedMovies(): Promise<any> {
        console.log(`Worst rated movies`);
        const moviesId = await this.raccoon.worstRated();
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async mostLikedMovies(): Promise<any> {
        console.log(`Most liked movies`);
        const moviesId = await this.raccoon.mostLiked();
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async movieLikers(movieId: string): Promise<string[]> {
        console.log(`Movie ${movieId} liked by users`);
        return this.raccoon.likedBy(movieId);
    }

    async likedMovieCount(movieId: string): Promise<number> {
        console.log(`Movie ${movieId} liked by users`);
        return this.raccoon.likedCount(movieId);
    }

    async disLikedMovieCount(movieId: string): Promise<number> {
        console.log(`Movie ${movieId} disliked by users`);
        return this.raccoon.dislikedCount(movieId);
    }

    /*
        Get User liked movies
        - The recommendation engine raccoon provides the allLikedFor method that takes user id.
        - Since the engine returns the movie ids, we need to get the movie details from the TMDB api.
        - For that, we use the getMoviesDetail method that takes the movie ids and returns the movie details.
    */
    async likedMovies(userId: string): Promise<string[]> {
        console.log(`User ${userId} liked movies`);
        const moviesId = await this.raccoon.allLikedFor(userId);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async disLikedMovies(userId: string): Promise<any> {
        console.log(`User ${userId} disliked movies`);
        const moviesId = await this.raccoon.allDislikedFor(userId);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    async watchedMovies(userId: string): Promise<any> {
        console.log(`User ${userId} watched movies`);
        const moviesId = await this.raccoon.allWatchedFor(userId);
        const movies = this.getMoviesDetail(moviesId);

        return movies;
    }

    // This method takes the movie id and returns the movie details from the TMDB api.
    async getMovieDetail(movieId: string): Promise<any> {
        console.log(`Movie ${movieId} detail`);
        const args = {
            pathParameters: {
                movie_id: movieId,
            },
        };
        return this.theMovieDbService.getMovieEndpoint().getDetails(args);
    }

    /* 
        This method takes the movie ids and returns the movie details from the TMDB api.
        - The TMDB api do not allows to get the movie details for multiple movies at once.
        - So, we need to call the getMovieDetail method for each movie id.
        - For that, we use the basic loop that loops through movies id and get movie details and add it to a array.
    */
    async getMoviesDetail(moviesId: string[]): Promise<any> {
        console.log(`Movies ${moviesId.length} detail`);
        let movies = [];
        for await (const element of moviesId) {
            await this.getMovieDetail(element).then(res => {
                if (res)
                    movies.push(res.data);
            }).catch(err => {
                console.log(err);
            });

        }

        return movies;
    }

    // This method takes genres id and page number and returns random movies from the TMDB api.
    async getRandomMovies(genresId: string, page: number=1): Promise<any> {
        console.log(`Random movies`);


        // Get a random page number between 1 and 100
        var randomPage = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

        const args = {
            query: {
                with_genres: genresId,
                page: randomPage
            },
        };
        // Check if genres id exists. If not, delete query paramerer and get random movies from all genres.
        if (!genresId) {
            delete args['query']['with_genres'];
        }

        const movies = await this.theMovieDbService.getDiscoverEndpoint().movie(args);

        return movies.data;
    }
}
