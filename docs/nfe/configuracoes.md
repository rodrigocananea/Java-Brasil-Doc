# Configurações

Para executar qualquer função NFe/NFCe, deve-se inicializar as configurações com `ConfiguracoesNfe.criarConfiguracoes`.

### Certificado Digital
```java 
import br.com.swconsultoria.certificado.Certificado;
import br.com.swconsultoria.certificado.CertificadoService;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.AmbienteEnum;
import br.com.swconsultoria.nfe.dom.enuns.EstadosEnum;

public class Config {

    public static ConfiguracoesNfe iniciaConfiguracoes() throws Exception {
        Certificado certificado = CertificadoService.certificadoPfx("d:/teste/certificado.pfx", "123456"); // (1)

        return ConfiguracoesNfe.criarConfiguracoes(
            EstadosEnum.GO,           // (2)
            AmbienteEnum.HOMOLOGACAO, // (3)
            certificado,
            "d:/nfe/schemas"          // (4)
        );
    }
}
```

1.  Para obter o certificado (A1, A3, repositório Windows, por CNPJ/CPF...) acesse [Java_Certificado](/certificado/index).
2.  Obtendo o estado a partir de String: `EstadosEnum.valueOf("GO")`.
3.  Obtendo o ambiente a partir de String: `AmbienteEnum.getByCodigo("2")`.
4.  Caminho da pasta onde foram extraídos os Schemas XSD ([schemas.zip](https://github.com/Samuel-Oliveira/Java_NFe/raw/master/schemas.zip)).

::: tip
`criarConfiguracoes` lança `CertificadoException` se o certificado estiver vencido ou inválido. O fuso padrão é `America/Sao_Paulo`; para outro fuso use a sobrecarga que recebe um `ZoneId`:

```java
ConfiguracoesNfe.criarConfiguracoes(EstadosEnum.AM, AmbienteEnum.PRODUCAO, certificado,
        "d:/nfe/schemas", ZoneId.of("America/Manaus"));
```
:::

### Logs

A biblioteca usa `java.util.logging`. Para ver as mensagens trocadas com a SEFAZ:

```java
Logger.getLogger("").setLevel(Level.ALL);     // habilita
Logger.getLogger("").setLevel(Level.WARNING); // somente avisos/erros
```

### Proxy

```java
import br.com.swconsultoria.nfe.dom.Proxy;

ConfiguracoesNfe config = ConfiguracoesNfe.criarConfiguracoes(EstadosEnum.GO, AmbienteEnum.HOMOLOGACAO, certificado, "d:/nfe/schemas");

// Parâmetros: ip, porta, usuário, senha
config.setProxy(new Proxy("192.168.0.1", 3128, "usuario", "senha"));
```

### Contingência SVC

Para situações em que não for possível estabelecer conexão com o WebService da SEFAZ de origem, ative a contingência SVC (SVC-AN / SVC-RS, conforme o estado):

```java
config.setContigenciaSVC(true);
```

### Outras opções

| Método | Descrição |
|---|---|
| `setTimeout(Integer)` | Tempo limite (em milissegundos) da comunicação com o WebService. Sugerido pelo manual do contribuinte: `30000`. |
| `setRetry(Integer)` | Número de tentativas de conexão com o WebService. Padrão: `3`. |
| `setValidacaoDocumento(boolean)` | Valida se o CNPJ/CPF do emitente confere com o do certificado (raiz do CNPJ). Padrão: `true`. |
| `setArquivoWebService(String)` | Caminho de um arquivo de WebServices (`.ini`) customizado, para sobrescrever as URLs internas. |
| `setCacert(InputStream)` | Cacert próprio (por padrão a biblioteca [Java_Certificado](/certificado/index) gerencia o cacert). |
| `setEncode(Charset)` / `setEncode(String)` | Encode usado na geração do XML. Padrão: `UTF-8`. |
| `setZoneId(ZoneId)` | Fuso horário usado nas datas dos eventos. Padrão: `America/Sao_Paulo`. |
