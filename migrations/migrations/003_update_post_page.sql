alter table articles
    add markdown_content TEXT not null  DEFAULT '' comment 'markdown 内容' after content;
alter table articles
    add is_markdown tinyint(1) unsigned NOT NULL DEFAULT 0 comment '是否是markdown 内容' after markdown_content;


alter table pages
    add markdown_content TEXT not null  DEFAULT '' comment 'markdown 内容' after content;
    
alter table pages
    add is_markdown tinyint(1) unsigned NOT NULL DEFAULT 0 comment '是否是markdown 内容' after markdown_content;



