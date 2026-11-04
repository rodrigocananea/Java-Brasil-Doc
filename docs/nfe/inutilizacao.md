# Inutilização

Função para inutilizar faixa de números da NF-e/NFC-e.

### Enviar evento de Inutilização
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.DocumentoEnum;
import br.com.swconsultoria.nfe.schemas.TInutNFe;
import br.com.swconsultoria.nfe.schemas.TRetInutNFe;
import br.com.swconsultoria.nfe.util.InutilizacaoUtil;
import br.com.swconsultoria.nfe.util.RetornoUtil;

import java.time.LocalDateTime;

/**
 * @author Samuel Oliveira
 */
public class InutilizarTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //Informe o CNPJ do emitente
            String cnpj = "XXX";
            //Informe a serie
            int serie = 1;
            //Informe a numeracao Inicial
            int numeroInicial = 10;
            //Informe a numeracao Final
            int numeroFinal = 12;
            //Informe a Justificativa da Inutilizacao (mínimo 15 caracteres)
            String justificativa = "Teste de Inutilização de numeração";
            //Informe a data da Inutilização
            LocalDateTime dataInutilizacao = LocalDateTime.now();

            //Monta Inutilização (DocumentoEnum.NFE ou DocumentoEnum.NFCE)
            TInutNFe inutNFe = InutilizacaoUtil.montaInutilizacao(DocumentoEnum.NFE, cnpj, serie, numeroInicial, numeroFinal, justificativa, dataInutilizacao, config);

            //Envia Inutilização
            TRetInutNFe retorno = Nfe.inutilizacao(config, inutNFe, DocumentoEnum.NFE, true);

            //Valida o Retorno da Inutilização
            RetornoUtil.validaInutilizacao(retorno);

            //Resultado
            System.out.println();
            System.out.println("# Status: " + retorno.getInfInut().getCStat() + " - " + retorno.getInfInut().getXMotivo());
            System.out.println("# Protocolo: " + retorno.getInfInut().getNProt());

            //Cria ProcInutilização (para armazenamento)
            String proc = InutilizacaoUtil.criaProcInutilizacao(config, inutNFe, retorno);
            System.out.println();
            System.out.println("# ProcInutilizacao : " + proc);

        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)
