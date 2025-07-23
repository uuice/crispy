alter table caches
    modify cache_data longtext default '' not null comment '缓存数据';

alter table caches
    add url varchar(255) default '' not null comment '原始url' after hash;
