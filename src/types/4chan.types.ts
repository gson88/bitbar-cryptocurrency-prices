export interface Page {
  page: number;
  threads: Thread[];
}

export interface Thread {
  no: number;
  now: string;
  name?: string; // Username
  sub?: string; // Title
  com?: string; // Message
  filename: string;
  ext: string;
  w: number;
  h: number;
  tn_w: number;
  tn_h: number;
  tim: number;
  time: number;
  md5: string;
  fsize: number;
  resto: number;
  id: string;
  bumplimit: number;
  imagelimit: number;
  semantic_url: string;
  replies: number;
  images: number;
  omitted_posts: number;
  omitted_images: number;
  last_replies: Reply[];
  last_modified: number;
}

interface Reply {
  no: number;
  now: string;
  name: string;
  com: string;
  filename: string;
  ext: string;
  w: number;
  h: number;
  tn_w: number;
  tn_h: number;
  tim: number;
  time: number;
  md5: string;
  fsize: number;
  resto: number;
  id: string;
}
