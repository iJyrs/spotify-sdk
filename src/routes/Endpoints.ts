import { Immutable, IntentScopes } from "../index";
import { HttpMethods, HttpContentTypes } from "./Routes";

type PagedObject<T> = Immutable<{

}>;

type TrackObject = Immutable<{

}>;

type SavedTrackObject = Immutable<{

}>;

type SimpleTrackObject = Immutable<{

}>;

type EpisodeObject = Immutable<{

}>;

type AlbumObject = Immutable<{

}>;

type PlaylistObject = Immutable<{

}>;

type AudiobookObject = Immutable<{

}>;

type AudiobookChapterObject = Immutable<{

}>;

type ShowObject = Immutable<{

}>;

type SimpleShowObject = Immutable<{

}>;

type SavedShowObject = Immutable<{

}>;

type ArtistObject = Immutable<{

}>;

type BrowseCategoryObject = Immutable<{

}>;

type DeviceObject = Immutable<{

}>;

type AudioFeaturesObject = Immutable<{

}>;

type AudioAnalysisObject = Immutable<{

}>;

type SuggestionSeedObject = Immutable<{

}>;

type ImageObject = Immutable<{
    uri: string;
    height?: number;
    width?: number;
}>;

type UserObject = Immutable<{

}>;

export type EndpointTransaction<
    O extends {} | undefined,
    R extends {} | undefined,
    H extends TransactionHref
> = Immutable<{ href: H, options?: O, response?: R }>;

export type TransactionHref = Immutable<{ method: HttpMethods, content_type?: HttpContentTypes, uri: string, scopes?: IntentScopes[] }>;
export type EndpointTransaction_t = EndpointTransaction<any, any, TransactionHref>;

export type EndpointOptions = Immutable<{

    id: string,
    ids: string[],
    device_id?: string,

    country?: string,
    market?: string,
    locale?: string,

    limit?: number,
    offset?: number,

    additional_types?: ("track" | "episode")[];
    fields: string; // TODO: Figure out how this works. (Too Lazy atm...)

    uris?: string[];

}>;

export type FetchAlbumOptions = Pick<EndpointOptions, "id" | "market">;
export type FetchAlbumTransaction = EndpointTransaction<FetchAlbumOptions, AlbumObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/albums/{id}"
}>;

export type FetchSeveralAlbumsOptions = Pick<EndpointOptions, "ids" | "market">;
export type FetchSeveralAlbumsResponse = Immutable<{ albums: AlbumObject[] }>;
export type FetchSeveralAlbumsTransaction = EndpointTransaction<FetchSeveralAlbumsOptions, FetchSeveralAlbumsResponse, {
    method: HttpMethods.GET
    uri: "https://api.spotify.com/v1/albums"
}>;

export type FetchAlbumTracksOptions = Pick<EndpointOptions, "id" | "market" | "limit" | "offset">;
export type FetchAlbumTracksResponse = PagedObject<SimpleTrackObject[]>;
export type FetchAlbumTracksTransaction = EndpointTransaction<FetchAlbumTracksOptions, FetchAlbumTracksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/albums/{id}/tracks"
}>;

export type FetchSavedAlbumsOptions = Pick<EndpointOptions, "market" | "limit" | "offset">;
export type FetchSavedAlbumsResponse = PagedObject<AlbumObject>;
export type FetchSavedAlbumsTransaction = EndpointTransaction<FetchSavedAlbumsOptions, FetchSavedAlbumsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/albums",
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type SaveAlbumsOptions = Pick<EndpointOptions, "ids">;
export type SaveAlbumsTransaction = EndpointTransaction<SaveAlbumsOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/albums",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type RemoveSavedAlbumsOptions = Pick<EndpointOptions, "ids">;
export type RemoveSavedAlbumsTransaction = EndpointTransaction<RemoveSavedAlbumsOptions, undefined, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/me/albums",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type CheckSavedAlbumsOptions = Pick<EndpointOptions, "ids">;
export type CheckSavedAlbumsResponse = Immutable<boolean[]>;
export type CheckSavedAlbumsTransaction = EndpointTransaction<CheckSavedAlbumsOptions, CheckSavedAlbumsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/albums/contains",
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type FetchNewReleasesOptions = Pick<EndpointOptions, "country" | "limit" | "offset">;
export type FetchNewReleasesResponse = Immutable<{ albums: PagedObject<AlbumObject> }>;
export type FetchNewReleasesTransaction = EndpointTransaction<FetchNewReleasesOptions, FetchNewReleasesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/browse/new-releases"
}>;

export type FetchArtistOptions = Pick<EndpointOptions, "id">;
export type FetchArtistTransaction = EndpointTransaction<FetchArtistOptions, ArtistObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/artists/{id}"
}>;

export type FetchSeveralArtistsOptions = Pick<EndpointOptions, "ids">;
export type FetchSeveralArtistsResponse = Immutable<{ artists: ArtistObject[] }>;
export type FetchSeveralArtistsTransaction = EndpointTransaction<FetchSeveralArtistsOptions, FetchSeveralArtistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/artists"
}>;

export type FetchArtistAlbumsOptions = Immutable<{
    include_groups?: ("album" | "single" | "appears_on" | "compilation")[],
}> & Pick<EndpointOptions, "id" | "market" | "limit" | "offset">;
export type FetchArtistAlbumsResponse = PagedObject<AlbumObject>;
export type FetchArtistAlbumsTransaction = EndpointTransaction<FetchArtistAlbumsOptions, FetchArtistAlbumsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/artists/{id}/albums"
}>;

export type FetchArtistTopTracksOptions = Pick<EndpointOptions, "id" | "market">;
export type FetchArtistTopTracksResponse = Immutable<{ tracks: TrackObject[] }>;
export type FetchArtistTopTracksTransaction = EndpointTransaction<FetchArtistTopTracksOptions, FetchArtistTopTracksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/artists/{id}/top-tracks"
}>;

export type FetchRelatedArtistsOptions = Pick<EndpointOptions, "id">;
export type FetchRelatedArtistsResponse = Immutable<{
    artists: ArtistObject[]
}>;
export type FetchRelatedArtistsTransaction = EndpointTransaction<FetchRelatedArtistsOptions, FetchRelatedArtistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/artists/{id}/related-artists"
}>;

export type FetchAudiobookOptions = Pick<EndpointOptions, "id" | "market">;
export type FetchAudiobookTransaction = EndpointTransaction<FetchAudiobookOptions, AudiobookObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/audiobooks/{id}"
}>;

export type FetchSeveralAudiobooksOptions = Pick<EndpointOptions, "ids" | "market">;
export type FetchSeveralAudiobooksResponse = Immutable<{
    audiobooks: AudiobookObject[]
}>;
export type FetchSeveralAudiobooksTransaction = EndpointTransaction<FetchSeveralAudiobooksOptions, FetchSeveralAudiobooksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/audiobooks"
}>;

export type FetchAudiobookChapterOptions = Pick<EndpointOptions, "id" | "market">;
export type FetchAudiobookChapterTransaction = EndpointTransaction<FetchAudiobookChapterOptions, AudiobookChapterObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/chapters/{id}"
}>;

export type FetchAudiobookChaptersOptions = Pick<EndpointOptions, "id" | "market" | "limit" | "offset"> | Pick<EndpointOptions, "ids" | "market">;
export type FetchAudiobookChaptersResponse = PagedObject<AudiobookChapterObject> | Immutable<{ chapters: AudiobookChapterObject[] }>;
export type FetchAudiobookChaptersTransaction = EndpointTransaction<FetchAudiobookChaptersOptions, FetchAudiobookChaptersResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/audiobooks" | "https://api.spotify.com/v1/chapters"
}>;

export type FetchSavedAudiobooksOptions = Pick<EndpointOptions, "limit" | "offset">;
export type FetchSavedAudiobooksResponse = PagedObject<AudiobookObject>;
export type FetchSavedAudiobooksTransaction = EndpointTransaction<FetchSavedAudiobooksOptions, FetchSavedAudiobooksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/audiobooks",
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type SaveAudiobooksOptions = Pick<EndpointOptions, "ids">;
export type SaveAudiobooksTransaction = EndpointTransaction<SaveAudiobooksOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/audiobooks",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type RemoveSavedAudiobooksOptions = Pick<EndpointOptions, "ids">;
export type RemoveSavedAudiobooksTransaction = EndpointTransaction<RemoveSavedAudiobooksOptions, undefined, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/me/audiobooks",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type CheckSavedAudiobooksOptions = Pick<EndpointOptions, "ids">;
export type CheckSavedAudiobooksResponse = Immutable<boolean[]>;
export type CheckSavedAudiobooksTransaction = EndpointTransaction<CheckSavedAudiobooksOptions, CheckSavedAudiobooksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/audiobooks/contains"
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type FetchBrowseCategoryOptions = Pick<EndpointOptions, "id" | "country" | "locale">;
export type FetchBrowseCategoryTransaction = EndpointTransaction<FetchBrowseCategoryOptions, BrowseCategoryObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/browse/categories/{id}"
}>;

export type FetchBrowseCategoriesOptions = Pick<EndpointOptions, "locale" | "limit" | "offset" | "country">;
export type FetchBrowseCategoriesResponse = Immutable<{ categories: PagedObject<BrowseCategoryObject> }>;
export type FetchBrowseCategoriesTransaction = EndpointTransaction<FetchBrowseCategoriesOptions, FetchBrowseCategoriesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/browse/categories"
}>;

export type FetchEpisodeOptions = Pick<EndpointOptions, "id" | "market">;
export type FetchEpisodeTransaction = EndpointTransaction<FetchEpisodeOptions, EpisodeObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/episodes/{id}",
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_POSITION
    ]
}>;

export type FetchEpisodesOptions = Pick<EndpointOptions, "ids" | "market">;
export type FetchEpisodesResponse = Immutable<{ episodes: EpisodeObject[] }>;
export type FetchEpisodesTransaction = EndpointTransaction<FetchEpisodesOptions, FetchEpisodesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/episodes",
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_POSITION
    ]
}>;

export type FetchSavedEpisodesOptions = Pick<EndpointOptions, "limit" | "offset" | "market">;
export type FetchSavedEpisodesResponse = PagedObject<EpisodeObject>;
export type FetchSavedEpisodesTransaction = EndpointTransaction<FetchSavedEpisodesOptions, FetchSavedEpisodesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/episodes"
    scopes: [
        IntentScopes.READ_USER_LIBRARY,
        IntentScopes.READ_USER_PLAYBACK_POSITION
    ]
}>;

export type SaveEpisodesOptions = Pick<EndpointOptions, "ids">;
export type SaveEpisodesTransaction = EndpointTransaction<SaveEpisodesOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/episodes",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type RemoveSavedEpisodesOptions = Pick<EndpointOptions, "ids">;
export type RemoveSavedEpisodesTransaction = EndpointTransaction<RemoveSavedEpisodesOptions, undefined, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/me/episodes",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type CheckSavedEpisodesOptions = Pick<EndpointOptions, "ids">;
export type CheckSavedEpisodesResponse = Immutable<boolean[]>;
export type CheckSavedEpisodesTransaction = EndpointTransaction<CheckSavedEpisodesOptions, CheckSavedEpisodesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/episodes/contains"
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type FetchGenreSeedsResponse = Immutable<{
    genres: string[]
}>;
export type FetchGenreSeedsTransaction = EndpointTransaction<undefined, FetchGenreSeedsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/recommendations/available-genre-seeds"
}>;

export type FetchAvailableMarketsResponse = Immutable<{
    markets: string[]
}>;
export type FetchAvailableMarketsTransaction = EndpointTransaction<undefined, FetchAvailableMarketsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/markets"
}>;

export type FetchPlayerStateOptions = Pick<EndpointOptions, "market" | "additional_types">;
export type FetchPlayerStateResponse = Immutable<{
    device: DeviceObject,
    item?: Immutable<TrackObject | EpisodeObject>,
    progress_ms?: number,
    is_playing: boolean,
    repeat_state: RepeatStates_t,
    shuffle_state: boolean,
    actions: any, // TODO: Write out the type for this. (Too Lazy atm...)
    context?: Immutable<{
        type: "artist" | "playlist" | "album" | "show",
        href: string,
        external_urls: { spotify: string },
        uri: string,
    }>,
    timestamp: number,
}> | undefined;
export type FetchPlayerStateTransaction = EndpointTransaction<FetchPlayerStateOptions, FetchPlayerStateResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/player",
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_STATE
    ]
}>;

export type TransferPlaybackOptions = Immutable<{
    device_id: string,
    play?: boolean
} & Pick<EndpointOptions, "device_id">>;
export type TransferPlaybackTransaction = EndpointTransaction<TransferPlaybackOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/player",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type GetAvailableDevicesResponse = Immutable<{
    devices: Immutable<DeviceObject>[],
}>;
export type GetAvailableDevicesTransaction = EndpointTransaction<undefined, GetAvailableDevicesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/player/devices",
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_STATE
    ]
}>;

export type FetchCurrentTrackOptions = Pick<EndpointOptions, "market" | "additional_types">;
export type FetchCurrentTrackResponse = FetchPlayerStateResponse;
export type FetchCurrentTrackTransaction = EndpointTransaction<FetchCurrentTrackOptions, FetchCurrentTrackResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/player/currently-playing",
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_STATE
    ]
}>;

export type StartTrackOptions = Immutable<{
    content_uri?: string,
    uris?: string[],
    offset?: {
        position?: number,
        uri?: string
    },
    position_ms: number
} & Pick<EndpointOptions, "device_id">>;
export type StartTrackTransaction = EndpointTransaction<StartTrackOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/player/play",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type PauseTrackOptions = Pick<EndpointOptions, "device_id">;
export type PauseTrackTransaction = EndpointTransaction<PauseTrackOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/player/pause",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type SkipTrackOptions = Pick<EndpointOptions, "device_id">;
export type SkipTrackTransaction = EndpointTransaction<SkipTrackOptions, undefined, {
    method: HttpMethods.POST,
    uri: "https://api.spotify.com/v1/me/player/next",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type PreviousTrackOptions = Pick<EndpointOptions, "device_id">;
export type PreviousTrackTransaction = EndpointTransaction<PreviousTrackOptions, undefined, {
    method: HttpMethods.POST,
    uri: "https://api.spotify.com/v1/me/player/previous",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type SeekTrackOptions = Immutable<{
    position_ms: number
} & Pick<EndpointOptions, "device_id">>;
export type SeekTrackTransaction = EndpointTransaction<SeekTrackOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/player/seek",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type RepeatStates_t = "track" | "context" | "off";
export type SetRepeatModeOptions = Immutable<{ state: RepeatStates_t } & Pick<EndpointOptions, "device_id">>;
export type SetRepeatModeTransaction = EndpointTransaction<SetRepeatModeOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/player/repeat",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type SetVolumeOptions = Immutable<{
    volume_percent: number
} & Pick<EndpointOptions, "device_id">>;
export type SetVolumeTransaction = EndpointTransaction<SetVolumeOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/player/volume",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type SetShuffleModeOptions = Immutable<{
    state: boolean
} & Pick<EndpointOptions, "device_id">>;
export type SetShuffleModeTransaction = EndpointTransaction<SetShuffleModeOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/player/shuffle",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type FetchRecentHistoryOptions = Immutable<{
    after?: number,
    before?: number
} & Pick<EndpointOptions, "limit">>;
export type FetchRecentHistoryResponse = Immutable<PagedObject<TrackObject>>;
export type FetchRecentHistoryTransaction = EndpointTransaction<FetchRecentHistoryOptions, FetchCurrentTrackResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/player/recently-played",
    scopes: [
        IntentScopes.READ_USER_RECENTLY_PLAYED
    ]
}>;

export type ContentResults_t = TrackObject | EpisodeObject;
export type FetchQueueResponse = Immutable<{
    currently_playing?: ContentResults_t,
    queue: ContentResults_t[]
}>;
export type FetchQueueTransaction = EndpointTransaction<undefined, any, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/player/queue"
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_STATE
    ]
}>;

export type AddToQueueOptions = Immutable<{
    uri: string,
} & Pick<EndpointOptions, "device_id">>;
export type AddToQueueTransaction = EndpointTransaction<AddToQueueOptions, undefined, {
    method: HttpMethods.POST,
    uri: "https://api.spotify.com/v1/me/player/queue",
    scopes: [
        IntentScopes.MODIFY_USER_PLAYBACK_STATE
    ]
}>;

export type FetchPlaylistOptions = Pick<EndpointOptions, "id" | "market" | "additional_types" | "fields">;
export type FetchPlaylistTransaction = EndpointTransaction<FetchPlaylistOptions, PlaylistObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/playlists/{id}",
}>;

export type ChangePlaylistDetailsOptions = Immutable<{
    name?: string,
    public?: boolean,
    collaborative?: boolean,
    description?: string
} & Pick<EndpointOptions, "id">>;
export type ChangePlaylistDetailsTransaction = EndpointTransaction<ChangePlaylistDetailsOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/playlists/{id}",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>;

export type FetchPlaylistTracksOptions = Pick<EndpointOptions, "market" | "fields" | "limit" | "offset" | "additional_types">
export type FetchPlaylistTracksResponse = PagedObject<TrackObject>;
export type FetchPlaylistTracksTransaction = EndpointTransaction<FetchPlaylistTracksOptions, FetchPlaylistTracksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/playlists/{id}/tracks"
    scopes: [
        IntentScopes.READ_PRIVATE_PLAYLIST
    ]
}>;

export type UpdatePlaylistTracksOptions = Immutable<{
    uris?: string[],
    range_start?: number
    insert_before?: number,
    range_length?: number,
    snapshot_id?: string
}> & Pick<EndpointOptions, "id">;
export type UpdatePlaylistTracksResponse = Immutable<{
   shapshot_id: string
}>;
export type UpdatePlaylistTransaction = EndpointTransaction<UpdatePlaylistTracksOptions, UpdatePlaylistTracksResponse, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/playlists/{id}/tracks",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>;

export type AddTracksToPlaylistOptions = Immutable<{
    position?: number,
}> & Pick<EndpointOptions, "id" | "uris">;
export type AddTracksToPlaylistResponse = Immutable<{
    snapshot_id: string
}>;
export type AddTracksToPlaylistTransaction = EndpointTransaction<AddTracksToPlaylistOptions, AddTracksToPlaylistResponse, {
    method: HttpMethods.POST,
    uri: "https://api.spotify.com/v1/playlists/{id}/tracks",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>;

export type RemovePlaylistTracksOptions = Immutable<{
    tracks: Immutable<{ uri: string }>[],
    snapshot_id?: string
}> & Pick<EndpointOptions, "id">;
export type RemovePlaylistTracksResponse = Immutable<{
    snapshot_id: string
}>;
export type RemovePlaylistTracksTransaction = EndpointTransaction<RemovePlaylistTracksOptions, RemovePlaylistTracksResponse, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/playlists/{id}/tracks",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>

export type FetchCurrentUsersPlaylistsOptions = Pick<EndpointOptions, "limit" | "offset">;
export type FetchCurrentUsersPlaylistsResponse = PagedObject<PlaylistObject>;
export type FetchCurrentUsersPlaylistsTransaction = EndpointTransaction<FetchCurrentUsersPlaylistsOptions, FetchCurrentUsersPlaylistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/playlists",
    scopes: [
        IntentScopes.READ_PRIVATE_PLAYLIST
    ]
}>;

export type FetchUsersPlaylistsOptions = Pick<EndpointOptions, "id" | "limit" | "offset">;
export type FetchUsersPlaylistsResponse = PagedObject<PlaylistObject>;
export type FetchUsersPlaylistsTransaction = EndpointTransaction<FetchUsersPlaylistsOptions, FetchUsersPlaylistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/users/{id}/playlists",
    scopes: [
        IntentScopes.READ_PRIVATE_PLAYLIST,
        IntentScopes.READ_COLLABORATIVE_PLAYLIST
    ]
}>;

export type CreatePlaylistOptions = Immutable<{
    name: string,
    public?: boolean,
    collaborative?: boolean,
    description?: string
}> & Pick<EndpointOptions, "id">;
export type CreatePlaylistTransaction = EndpointTransaction<CreatePlaylistOptions, PlaylistObject, {
    method: HttpMethods.POST,
    uri: "https://api.spotify.com/v1/users/{id}/playlists",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>;

export type FetchFeaturedPlaylistsOptions = Immutable<{
    timestamp?: string,
}> & Pick<EndpointOptions, "locale" | "country" | "limit" | "offset">;
export type FetchFeaturedPlaylistsResponse = PagedObject<PlaylistObject>;
export type FetchFeaturedPlaylistsTransaction = EndpointTransaction<FetchFeaturedPlaylistsOptions, FetchFeaturedPlaylistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/browse/featured-playlists",
}>;

export type FetchCategoryPlaylistsOptions = Pick<EndpointOptions, "id" | "country" | "limit" | "offset">;
export type FetchCategoryPlaylistsResponse = PagedObject<PlaylistObject>;
export type FetchCategoryPlaylistsTransaction = EndpointTransaction<FetchCategoryPlaylistsOptions, FetchCategoryPlaylistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/browse/categories/{id}/playlists",
}>;

export type FetchPlaylistCoverImageOptions = Pick<EndpointOptions, "id">;
export type FetchPlaylistCoverImageResponse = ImageObject[];
export type FetchPlaylistCoverImageTransaction = EndpointTransaction<FetchPlaylistCoverImageOptions, FetchPlaylistCoverImageResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/playlists/{id}/images",
}>;

export type ChangePlaylistCoverImageOptions = Immutable<any> & Pick<EndpointOptions, "id">;
export type ChangePlaylistCoverImageTransaction = EndpointTransaction<ChangePlaylistCoverImageOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/playlists/{id}/images",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>;

export type SearchOptions = Immutable<{
    q: string,
    type: ("album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook")[],
    include_external?: "audio"
}> & Pick<EndpointOptions, "market" | "limit" | "offset">;
export type SearchResponse = Immutable<{
    tracks?: PagedObject<TrackObject>,
    artists?: PagedObject<ArtistObject>,
    albums?: PagedObject<AlbumObject>,
    playlists?: PagedObject<PlaylistObject>,
    shows?: PagedObject<ShowObject>,
    episodes?: PagedObject<EpisodeObject>,
    audiobooks?: PagedObject<EpisodeObject>
}>;
export type SearchTransaction = EndpointTransaction<SearchOptions, SearchResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/search",
}>;

export type FetchShowOptions = Pick<EndpointOptions, "id" | "market">;
export type FetchShowTransaction = EndpointTransaction<FetchShowOptions, ShowObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/shows/{id}",
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_POSITION
    ]
}>;

export type FetchShowsOptions = Pick<EndpointOptions, "ids" | "market">;
export type FetchShowsResponse = Immutable<{ shows: SimpleShowObject[] }>;
export type FetchShowsTransaction = EndpointTransaction<FetchShowsOptions, FetchShowsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/shows",
}>;

export type FetchShowEpisodes = Pick<EndpointOptions, "id" | "market" | "limit" | "offset">;
export type FetchShowEpisodesResponse = PagedObject<EpisodeObject>;
export type FetchShowEpisodesTransaction = EndpointTransaction<FetchShowEpisodes, FetchShowEpisodesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/shows/{id}/episodes",
    scopes: [
        IntentScopes.READ_USER_PLAYBACK_POSITION
    ]
}>;

export type FetchSavedShowsOptions = Pick<EndpointOptions, "limit" | "offset">;
export type FetchSavedShowsResponse = PagedObject<SavedShowObject>;
export type FetchSavedShowsTransaction = EndpointTransaction<FetchSavedShowsOptions, FetchSavedShowsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/shows",
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type SaveShowsOptions = Pick<EndpointOptions, "ids">;
export type SaveShowsTransaction = EndpointTransaction<SaveShowsOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/shows",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type RemoveSavedShowsOptions = Pick<EndpointOptions, "ids" | "market">;
export type RemoveSavedShowsTransaction = EndpointTransaction<RemoveSavedShowsOptions, undefined, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/me/shows",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type CheckSavedShowsOptions = Pick<EndpointOptions, "ids">;
export type CheckSavedShowsResponse = Immutable<boolean[]>;
export type CheckSavedShowsTransaction = EndpointTransaction<CheckSavedShowsOptions, CheckSavedShowsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/shows/contains",
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type FetchTrackOptions = Pick<EndpointOptions, "id" | "market">;
export type FetchTrackTransaction = EndpointTransaction<FetchTrackOptions, TrackObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/tracks/{id}",
}>;

export type FetchTracksOptions = Pick<EndpointOptions, "ids" | "market">;
export type FetchTracksResponse = Immutable<{ tracks: TrackObject[] }>;
export type FetchTracksTransaction = EndpointTransaction<FetchTracksOptions, FetchTracksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/tracks",
}>;

export type FetchSavedTracksOptions = Pick<EndpointOptions, "limit" | "offset" | "market">;
export type FetchSavedTracksResponse = PagedObject<SavedTrackObject>;
export type FetchSavedTracksTransaction = EndpointTransaction<FetchSavedTracksOptions, FetchSavedTracksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/tracks",
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type SaveTracksOptions = Pick<EndpointOptions, "ids">;
export type SaveTracksTransaction = EndpointTransaction<SaveTracksOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/tracks",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type RemoveSavedTracksOptions = Pick<EndpointOptions, "ids">;
export type RemoveSavedTracksTransaction = EndpointTransaction<RemoveSavedTracksOptions, undefined, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/me/tracks",
    scopes: [
        IntentScopes.MODIFY_USER_LIBRARY
    ]
}>;

export type CheckSavedTracksOptions = Pick<EndpointOptions, "ids">;
export type CheckSavedTracksResponse = Immutable<boolean[]>;
export type CheckSavedTracksTransaction = EndpointTransaction<CheckSavedTracksOptions, CheckSavedTracksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/tracks/contains",
    scopes: [
        IntentScopes.READ_USER_LIBRARY
    ]
}>;

export type FetchTracksAudioFeaturesOptions = Pick<EndpointOptions, "id">;
export type FetchTracksAudioFeaturesResponse = Immutable<AudioFeaturesObject>;
export type FetchTracksAudioFeaturesTransaction = EndpointTransaction<FetchTracksAudioFeaturesOptions, FetchTracksAudioFeaturesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/audio-features/{id}",
}>;

export type FetchSeveralTracksAudioFeaturesOptions = Pick<EndpointOptions, "ids">;
export type FetchSeveralTracksAudioFeaturesResponse = Immutable<{ audio_features: AudioFeaturesObject[] }>;
export type FetchSeveralTracksAudioFeaturesTransaction = EndpointTransaction<FetchSeveralTracksAudioFeaturesOptions, FetchSeveralTracksAudioFeaturesResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/audio-features",
}>;

export type FetchTrackAudioAnalysisOptions = Pick<EndpointOptions, "id">;
export type FetchTrackAudioAnalysisResponse = Immutable<AudioAnalysisObject>;
export type FetchTrackAudioAnalysisTransaction = EndpointTransaction<FetchTrackAudioAnalysisOptions, FetchTrackAudioAnalysisResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/audio-analysis/{id}",
}>;

export type FetchTrackSuggestionsOptions = Immutable<{
    seed_artists: string[],
    seed_genres: string[],
    seed_tracks: string[],

    min_acousticness?: number,
    max_acousticness?: number,
    target_acousticness?: number,

    min_danceability?: number,
    max_danceability?: number,
    target_danceability?: number,

    min_duration_ms?: number,
    max_duration_ms?: number,
    target_duration_ms?: number,

    min_energy?: number,
    max_energy?: number,
    target_energy?: number,

    min_instrumentalness?: number,
    max_instrumentalness?: number,
    target_instrumentalness?: number,

    min_key?: number,
    max_key?: number,
    target_key?: number,

    min_liveness?: number,
    max_liveness?: number,
    target_liveness?: number,

    min_loudness?: number,
    max_loudness?: number,
    target_loudness?: number,

    min_mode?: number,
    max_mode?: number,
    target_mode?: number,

    min_popularity?: number,
    max_popularity?: number,
    target_popularity?: number,

    min_speechiness?: number,
    max_speechiness?: number,
    target_speechiness?: number,

    min_tempo?: number,
    max_tempo?: number,
    target_tempo?: number,

    min_time_signature?: number,
    max_time_signature?: number,
    target_time_signature?: number,

    min_valence?: number,
    max_valence?: number,
    target_valence?: number,
}> & Pick<EndpointOptions, "limit" | "market">;
export type FetchTrackSuggestionsResponse = Immutable<{ seeds: SuggestionSeedObject, tracks: TrackObject[] }>;

export type FetchCurrentProfileTransaction = EndpointTransaction<undefined, UserObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me",
    scopes: [
        IntentScopes.READ_PRIVATE_USER_INFORMATION,
        IntentScopes.READ_EMAIL_ADDRESS
    ]
}>;

export type FetchUsersTopTracksOptions = {
    time_range?: "long_term" | "medium_term" | "short_term"
} & Pick<EndpointOptions, "limit" | "offset">;
export type FetchUsersTopTracksResponse = PagedObject<TrackObject>;
export type FetchUsersTopTracksTransaction = EndpointTransaction<FetchUsersTopTracksOptions, FetchUsersTopTracksResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/top/tracks",
    scopes: [
        IntentScopes.READ_USER_TOP_ARTISTS_AND_TRACKS
    ]
}>;

export type FetchUsersTopArtistsOptions = FetchUsersTopTracksOptions;
export type FetchUsersTopArtistsResponse = PagedObject<ArtistObject>;
export type FetchUsersTopArtistsTransaction = EndpointTransaction<FetchUsersTopArtistsOptions, FetchUsersTopArtistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/top/artists",
    scopes: [
        IntentScopes.READ_USER_TOP_ARTISTS_AND_TRACKS
    ]
}>;

export type FetchUserProfileOptions = Pick<EndpointOptions, "id">;
export type FetchUserProfileTransaction = EndpointTransaction<FetchUserProfileOptions, UserObject, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/users/{id}",
}>;

export type FollowPlaylistOptions = Immutable<{
    public?: boolean
}> & Pick<EndpointOptions, "id">;
export type FollowPlaylistTransaction = EndpointTransaction<FollowPlaylistOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/playlists/{id}/followers",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>;

export type UnfollowPlaylistOptions = Pick<EndpointOptions, "id">;
export type UnfollowPlaylistTransaction = EndpointTransaction<UnfollowPlaylistOptions, undefined, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/playlists/{id}/followers",
    scopes: [
        IntentScopes.MODIFY_PUBLIC_PLAYLIST,
        IntentScopes.MODIFY_PRIVATE_PLAYLIST
    ]
}>;

export type FetchFollowedArtistsOptions = Immutable<{
    type: "artist"
    after?: string
}> & Pick<EndpointOptions, "limit">;
export type FetchFollowedArtistsResponse = PagedObject<ArtistObject>;
export type FetchFollowedArtistsTransaction = EndpointTransaction<FetchFollowedArtistsOptions, FetchFollowedArtistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/following",
    scopes: [
        IntentScopes.READ_USER_FOLLOWED_ARTISTS
    ]
}>;

export type FollowAccountOptions = Immutable<{
    type: "artist" | "user"
}> & Pick<EndpointOptions, "ids">;
export type FollowAccountTransaction = EndpointTransaction<FollowAccountOptions, undefined, {
    method: HttpMethods.PUT,
    uri: "https://api.spotify.com/v1/me/following",
    scopes: [
        IntentScopes.MODIFY_USER_FOLLOWING
    ]
}>;

export type UnfollowAccountOptions = Immutable<{
    type: "artist" | "user"
}> & Pick<EndpointOptions, "ids">;
export type UnfollowAccountTransaction = EndpointTransaction<UnfollowAccountOptions, undefined, {
    method: HttpMethods.DELETE,
    uri: "https://api.spotify.com/v1/me/following",
    scopes: [
        IntentScopes.MODIFY_USER_FOLLOWING
    ]
}>;

export type CheckUsersFollowingOptions = Immutable<{
    type: "artist" | "user"
}> & Pick<EndpointOptions, "ids">;
export type CheckUsersFollowingResponse = Immutable<boolean[]>;
export type CheckUsersFollowingTransaction = EndpointTransaction<CheckUsersFollowingOptions, CheckUsersFollowingResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/me/following/contains",
    scopes: [
        IntentScopes.READ_USER_FOLLOWED_ARTISTS
    ]
}>;

export type CheckUsersFollowingPlaylistsOptions = Pick<EndpointOptions, "id" | "ids">;
export type CheckUsersFollowingPlaylistsResponse = Immutable<boolean[]>;
export type CheckUsersFollowingPlaylistsTransaction = EndpointTransaction<CheckUsersFollowingPlaylistsOptions, CheckUsersFollowingPlaylistsResponse, {
    method: HttpMethods.GET,
    uri: "https://api.spotify.com/v1/playlists/{id}/followers/contains",
    scopes: [
        IntentScopes.READ_USER_FOLLOWED_ARTISTS
    ]
}>;
