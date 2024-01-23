export class Comment {
  // NOTE  @Column({ type: 'int', nullable: false, default: 0 })
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  is_active: number;
}
