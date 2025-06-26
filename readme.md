# RepoWhisper
## 🧾 Explicação de cada campo:

| Campo       | Descrição                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `BlockIO`   | Quantidade de dados lidos e escritos no disco pelo container. O formato é `"Leitura / Escrita"`. |
| `CPUPerc`   | Porcentagem de uso da CPU pelo container em relação ao total disponível no host.                 |
| `Container` | ID completo ou parcial do container. Pode ser o mesmo de `ID`.                                   |
| `ID`        | ID do container (geralmente os primeiros 12 caracteres do hash SHA do container).                |
| `MemPerc`   | Porcentagem de uso de memória do container em relação ao limite de memória alocado.              |
| `MemUsage`  | Memória usada pelo container / limite total de memória disponível ao container.                  |
| `Name`      | Nome amigável do container, definido na criação ou automaticamente gerado.                       |
| `NetIO`     | Quantidade de dados transmitidos e recebidos via rede. Formato `"Enviado / Recebido"`.           |
| `PIDs`      | Número de processos (Process IDs) em execução dentro do container.                               |


#### Exemplo de serviço:

```
[Unit]
Description=RepoWhisper Node.js App (Node 20 via NVM)
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/<user>/<projetos>/RepoWhisper
ExecStart=/home/<user>/<projetos>/RepoWhisper/start.sh
Restart=always
RestartSec=10
Environment=NODE_ENV=production
User=root
Group=root

[Install]
WantedBy=multi-user.target
```