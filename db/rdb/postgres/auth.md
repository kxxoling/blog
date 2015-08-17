# PostgreSQL 身份认证的几种方式

PostgreSQL 可以在 ``pg_hba.conf`` 中配置认证机制，格式可以是下面任意一种：

```ini
local      DATABASE  USER  METHOD  [OPTIONS]
host       DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
hostssl    DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
hostnossl  DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
```

其中 Method 的类型可以是 ``trust``、``reject``、``md5``、``password``、``gss``、``sspi``、
``ident``、``peer``、``pam``、``ldap``、``radius`` 或者 ``cert``。

| 参数 | 认证方式
|----------|------------------------
| trust  | 不对连接进行认证。这将允许任何可以连接到 PostgreSQL 的人以任何 PostgreSQL 用户身份进行连接，连密码都不需要提供。
| reject  | 无条件拒绝连接。通常用于屏蔽某个群组的主机连接。
| md5  | 要求客户端提供 MD5 加密的密码用于验证。
| password  | 需要原始密码用于用户校验。用户密码将通过明文传播，不推荐在不可信网络中使用。
| gss  | 通过 GSSAPI 来验证用户身份。仅支持 TCP/IP 连接。
| sspi  | 通过 SSPI 来验证用户身份。仅支持 Windows。
| krb5 | 通过 Kerberos V5 来验证用户身份。仅支持 TCP/IP 连接。
| ident | Obtain the operating system user name of the client (for TCP/IP connections by contacting the ident server on the client, for local connections by getting it from the operating system) and check if it matches the requested database user name.  根据客户端用户用户名匹配数据库用户名。（远程通过 TCP/IP 连接通信，本地通信决定于系统）
| ldap | 使用 LDAP 服务器认证。
| cert | 使用客户端 SSL 证书进行认证。
| pam  | 由系统提供的可插拔认证模块（[Pluggable Authentication Modules，PAM]） 进行认证。

一台线上 PostgreSQL 的 ``pg_hba.conf`` 中的配置可能如下：

```ini
host    windrunner_db    windrunner    127.0.0.1/32    trust
host    all    all    10.1.1.0/24    md5
```

意思是，对于本机登录用户 windrunner 访问 windrunner_db 数据库是不需要安全验证的，
对于 10.1.1.0/24 网段的所有用户采用 md5 加密的密码验证方式。

详细可参考 [PostgreSQL wiki](https://wiki.postgresql.org/wiki/9.1第十九章)。
其它参考：[Pluggable Authentication Modules，PAM]

[Pluggable Authentication Modules，PAM]: http://en.wikipedia.org/wiki/Pluggable_authentication_module

