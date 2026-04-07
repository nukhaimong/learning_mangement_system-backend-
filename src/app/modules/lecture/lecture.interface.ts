export interface ICreateLecturePayload {
  title: string;
  module_id: string;
  video_url: string;
}

export interface IInsertLecturePayload {
  title: string;
  video_url: string;
}

export interface IUpdateLecturePayload {
  title?: string;
  video_url?: string;
}
