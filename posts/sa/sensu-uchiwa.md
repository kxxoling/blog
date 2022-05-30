# 在 Ubuntu 上安装 Sensu 和 Uchiwa

```sh
# 添加 RabbitMQ 源
curl -s http://www.rabbitmq.com/rabbitmq-signing-key-public.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://www.rabbitmq.com/debian/ testing main" >> /etc/apt/sources.list.d/rabbitmq.list'
# 添加 Sensu 源
curl -s http://repos.sensuapp.org/apt/pubkey.gpg | sudo apt-key add -
sudo sh -c 'echo "deb http://repos.sensuapp.org/apt sensu main" >> /etc/apt/sources.list.d/sensu.list'

# 安装 Erlang、RabbitMQ、Redis、Sensu 和 Uchiwa
sudo apt-get update && sudo apt-get install -y --allow-unauthenticated erlang-nox rabbitmq-server redis-server sensu uchiwa

# 为 Sensu 添加 RabbitMQ 控制
sudo rabbitmqctl add_vhost /sensu
sudo rabbitmqctl add_user sensu monitor
sudo rabbitmqctl set_permissions -p /sensu sensu ".*" ".*" ".*"

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable sensu-client sensu-server sensu-api uchiwa

sudo cp /etc/sensu/config.json.example /etc/sensu/config.json
sudo systemctl start sensu-client sensu-server sensu-api uchiwa
```
