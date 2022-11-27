# Configurações

Para executar qualquer função CTe, deve-se inicializar as Configuração.

#### Certificado Digital

```java
import br.com.swconsultoria.certificado.Certificado;
import br.com.swconsultoria.certificado.exception.CertificadoException;
import br.com.swconsultoria.cte.dom.ConfiguracoesCte;
import br.com.swconsultoria.cte.dom.enuns.AmbienteEnum;
import br.com.swconsultoria.cte.dom.enuns.EstadosEnum;

import java.io.FileNotFoundException;

/**
 * @author Samuel Oliveira
 */
public class ConfigTeste {

    public static ConfiguracoesCte iniciaConfiguracoes(EstadosEnum estado, AmbienteEnum ambiente) throws CertificadoException, FileNotFoundException {

        Certificado certificado = // Obter certificado (1)

        return ConfiguracoesCte.criarConfiguracoes(
                EstadosEnum.GO, // (2)
                AmbienteEnum.HOMOLOGACAO, // (3)
                certificado, 
                "D:\\Sistemas\\cte\\Schemas" // (4)
        );

    }
}
```

1.  Para obter o código de uso do certificado, você deve acessar em [Java_Certificado](/certificado/index)
2.  Obtendo estado a partir de String EstadosEnum.valueOf("GO")
3.  Obtendo ambiente a partir de String AmbienteEnum.getByCodigo("2")
4.  Caminho da pasta que se encontra os Schemas Xsd





