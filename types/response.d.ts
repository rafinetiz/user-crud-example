export interface BaseResponse {
	message: string;
}

export type Response<D = any> = BaseResponse & {
	data?: D;
};

export type GetUserResponse = Response<{
	user_id: number;
}>;
