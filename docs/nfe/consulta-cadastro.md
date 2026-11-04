# Consulta Cadastro

Função para consultar o cadastro do contribuinte (CNPJ/CPF) na Sefaz.

### Consulta Cadastro 
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.EstadosEnum;
import br.com.swconsultoria.nfe.dom.enuns.PessoaEnum;
import br.com.swconsultoria.nfe.schemas.TRetConsCad;
import br.com.swconsultoria.nfe.util.RetornoUtil;

/**
 * @author Samuel Oliveira
 */
public class ConsultaCadastroTeste {
    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //Envia a Consulta: tipo de pessoa, CNPJ/CPF e o Estado onde o contribuinte está cadastrado (2)
            TRetConsCad retorno = Nfe.consultaCadastro(config, PessoaEnum.JURIDICA, "XXX", EstadosEnum.GO);

            //Valida o Retorno da Consulta Cadastro
            RetornoUtil.validaConsultaCadastro(retorno);

            //Resultado
            System.out.println();
            System.out.println("# Status: " + retorno.getInfCons().getCStat() + " - " + retorno.getInfCons().getXMotivo());
            System.out.println();
            retorno.getInfCons().getInfCad().forEach( cadastro -> {
                System.out.println("# Razão Social: " + cadastro.getXNome());
                System.out.println("# Cnpj: " + cadastro.getCNPJ());
                System.out.println("# Ie: " + cadastro.getIE());
            });

        } catch (Exception e) {
            System.err.println();
            System.err.println(e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)
2.  Nem todos os estados disponibilizam o serviço, e alguns só permitem consultar contribuintes cadastrados no próprio estado (ex.: cStat `259` - CNPJ não cadastrado).
