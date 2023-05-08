# Extras

Informações adicionais para uso da lib.


### Exclusão de dependências
Quando ocorrer conflitos ao utilizar a lib (um dos casos sendo a java_certificado) você pode informar a exclusão dela no uso da lib
```xml
<dependency>
    <groupId>br.com.swconsultoria</groupId>
    <artifactId>java-cte</artifactId>
    <version>3.00.9</version>
    <exclusions>
        <exclusion>
            <groupId>br.com.swconsultoria</groupId>
            <artifactId>java_certificado</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```