package pl.put.poznan.rulework.service;

import org.rulelearn.data.*;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@Service
public class ImportService {

    private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

    public static InformationTable informationTable;

    public String importData(MultipartFile metadataFile, MultipartFile dataFile, String format) throws IOException {

        logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());
        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());
        logger.info("Data's format: " + format);

        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(metadataFile.getInputStream());
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        ObjectParser objectParser = new ObjectParser.Builder(attributes).header(true).build();
        reader = new InputStreamReader(dataFile.getInputStream());
        informationTable = objectParser.parseObjects(reader);
        Table<EvaluationAttribute, EvaluationField> table = informationTable.getActiveConditionAttributeFields();
        for(int i = 0; i < table.getNumberOfObjects(); i++) {
            StringBuilder sb = new StringBuilder();
            sb.append(i);
            sb.append(":");
            for(int j = 0; j < table.getNumberOfAttributes(); j++) {
                sb.append("\t");
                sb.append(table.getField(i, j));
            }
            logger.info(sb.toString());
        }

        return "End of uploadFile (POST)";
    }

}
