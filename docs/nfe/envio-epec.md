# Envio EPEC

Evento Prévio de Emissão em Contingência (EPEC). A nota que será emitida em contingência deve ter a chave gerada com **`tpEmis = 4`** — chaves com outro tipo de emissão são rejeitadas (cStat `484`).

### Envio
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.Evento;
import br.com.swconsultoria.nfe.dom.EventoEpec;
import br.com.swconsultoria.nfe.dom.enuns.EstadosEnum;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoEpec;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEnvEventoEpec;
import br.com.swconsultoria.nfe.util.ChaveUtil;
import br.com.swconsultoria.nfe.util.EpecUtil;
import br.com.swconsultoria.nfe.util.RetornoUtil;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * @author Samuel Oliveira
 */
public class EpecTeste {
    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            String cnpjEmit = "XXX";
            int numeroNfe = 1234;
            String cnf = String.format("%08d", new Random().nextInt(99999999));

            //Monta a chave da nota que será emitida em contingência (tpEmis = 4)
            ChaveUtil chaveUtil = new ChaveUtil(EstadosEnum.GO, cnpjEmit, "55", 1,
                    numeroNfe, "4", cnf, LocalDateTime.now());

            //O evento aceita uma lista para envio em Lote.
            Evento epec = new Evento();
            //Informe a chave da EPEC (sem o prefixo "NFe")
            epec.setChave(chaveUtil.getChaveNF().replace("NFe", ""));
            //Informe o CNPJ do emitente
            epec.setCnpj(cnpjEmit);
            //Informe a data do EPEC
            epec.setDataEvento(LocalDateTime.now());

            //Preenche os Dados do Evento EPEC
            EventoEpec eventoEpec = new EventoEpec();
            eventoEpec.setCnpjDestinatario("XXX");     // ou setCpfDestinatario
            eventoEpec.setvST("0.00");
            eventoEpec.setvNF("13.00");
            eventoEpec.setvICMS("0.00");
            eventoEpec.setTipoNF("1");                 // 0 = Entrada, 1 = Saída
            eventoEpec.setIeEmitente("XXX");
            eventoEpec.setIeDestinatario("XXX");
            eventoEpec.setEstadoDestinatario(EstadosEnum.GO);
            epec.setEventoEpec(eventoEpec);

            //Monta o Evento EPEC
            TEnvEventoEpec enviEvento = EpecUtil.montaEpec(epec, config);

            //Envia Evento EPEC
            TRetEnvEventoEpec retorno = Nfe.enviarEpec(config, enviEvento, true);

            //Valida o Retorno do EPEC
            RetornoUtil.validaEpec(retorno);

            //Resultado
            System.out.println();
            retorno.getRetEvento().forEach( resultado -> {
                System.out.println("# Chave: " + resultado.getInfEvento().getChNFe());
                System.out.println("# Status: " + resultado.getInfEvento().getCStat() + " - " + resultado.getInfEvento().getXMotivo());
                System.out.println("# Protocolo: " + resultado.getInfEvento().getNProt());
            });

            //Cria ProcEvento do EPEC
            String proc = EpecUtil.criaProcEventoEpec(config, enviEvento, retorno);
            System.out.println();
            System.out.println("# ProcEvento : " + proc);

        } catch (Exception e) {
            System.err.println();
            System.err.println("# Erro: " + e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)
