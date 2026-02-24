-- Binary table for storing binary data
CREATE TABLE IF NOT EXISTS `binary` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `key` varchar(255) NOT NULL DEFAULT '' COMMENT '键名',
  `binary_str` text NOT NULL COMMENT '二进制字符串',
  `status` tinyint(2) unsigned NOT NULL DEFAULT 10 COMMENT '状态',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='二进制数据存储表';

-- -- Down
-- DROP TABLE `binary`;
