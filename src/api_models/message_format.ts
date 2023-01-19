// Message format interface for the API
export interface IMessage_format {
  //Message
  id?: string;
  body?: string;
  text?: string;
  /* type?: chat_type; */
  from?: string;
  to?: string;
  isForwarded?: boolean;
  chat_id?: string;
  _serialized_chat_id?: string;
  isFrom_group?: boolean;
  isMedia?: boolean;
  last_chat_message_id?: string;
  not_Spam?: boolean;
  timestamp?: number | string;
  //Sender
  sender_id?: string;
  sender_name?: string;
  sender_number?: string;
  sender_pfp?: string;
  //Extra params
  command_key?: string;
  command_key_raw?: string;
  command_params?: Array<string>;
  specific?: any;
  //Client Name
  client_name?: any;
  // Specific
  group: IGroup_format;
  contact: IContact_format;
}

export interface IGroup_format {
  group_id: string;
  group_name: string;
  group_description: string;
  group_creation: number;
  group_owner: string;
  group_participants: any;
  group_size: number;
  group_read_only: boolean;
  group_isOpen: boolean;
  group_inviteLink?: string;
  group_pfp?: string;
}

// Contact Interface
export interface IContact_format {
  id: string;
  name: string;
  number: string;
  isBusiness: boolean;
  isEnterprise: boolean;
  statusMute: boolean;
  labels: Array<string>;
  formattedName: string;
  isMe: boolean;
  isMyContact: boolean;
  isWAContact: boolean;
  pushname: string;
  isOnline: boolean;
  lastSeen: any;
  isBlocked: boolean;
}