// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type GoodsFromListItem = {
    id: number;
    name?: string;
    address?: string;
    phone?: string;
  };

  type GoodsFromList = {
    data?: GoodsFromListItem[];
    total?: number;
    success?: boolean;
  };

  type GoodsInputListItem = {
    id: number;
    from_id?: number;
    from_name?: string;
    from_phone?: string;
    from_address?: string;
    created_at?: Date;
    cost?: number;
    pay_log?: string;
    pay?: number;
    status?: boolean;
    log?: string;
  };

  type GoodsInputList = {
    data?: GoodsInputListItem[];
    total?: number;
    success?: boolean;
  };

  type GoodsInputItemListItem = {
    id: number;
    order_id?: number;
    length?: number;
    diameter?: number;
    unit?: number;
    price?: number;
    total?: number;
    amount?: number;
    state?: boolean;
    created_at?: Date;
  };

  type GoodsInputItemList = {
    data?: GoodsInputItemListItem[];
    total?: number;
    success?: boolean;
  };

  type AccountListItem = {
    id: number;
    type?: string;
    order_id?: number;
    method?: string;
    created_at?: Date;
    amount?: number;
    another_id?: number;
  };

  type AccountList = {
    data?: AccountListItem[];
    total?: number;
    success?: boolean;
  };
}
