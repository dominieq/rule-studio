package pl.put.poznan.rulework.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.rulelearn.data.*;
import org.rulelearn.data.csv.ObjectParser;
import org.rulelearn.data.json.AttributeParser;
import org.rulelearn.data.json.InformationTableWriter;
import org.rulelearn.types.EvaluationField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImportService {

    private static final Logger logger = LoggerFactory.getLogger(ImportService.class);

    public static InformationTable informationTable;

    public String importData(MultipartFile metadataFile, MultipartFile dataFile) throws IOException {

        logger.info("Metadata:\t" + metadataFile.getOriginalFilename() + "\t" + metadataFile.getContentType());
        logger.info("Data:\t" + dataFile.getOriginalFilename() + "\t" + dataFile.getContentType());

        Attribute[] attributes;
        AttributeParser attributeParser = new AttributeParser();
        Reader reader = new InputStreamReader(metadataFile.getInputStream());
        attributes = attributeParser.parseAttributes(reader);
        for(int i = 0; i < attributes.length; i++) {
            logger.info(i + ":\t" + attributes[i]);
        }

        if (dataFile.getContentType().equals("application/json")) {
            logger.info("Data type is json");
            org.rulelearn.data.json.ObjectParser objectParser = new org.rulelearn.data.json.ObjectParser.Builder(attributes).build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);

        } else if (dataFile.getContentType().equals("application/vnd.ms-excel")) {
            logger.info("Data type is csv");
            ObjectParser objectParser = new ObjectParser.Builder(attributes).build();
            reader = new InputStreamReader(dataFile.getInputStream());
            informationTable = objectParser.parseObjects(reader);
        } else {
            logger.error("Unrecognized format of data file: " + dataFile.getContentType());
        }


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

        StringWriter attributesWriter = new StringWriter();
        StringWriter objectsWriter = new StringWriter();
        InformationTableWriter itw = new InformationTableWriter(true);
        itw.writeAttributes(informationTable, attributesWriter);
        itw.writeObjects(informationTable, objectsWriter);
        logger.info("attributesWriter:\n" + attributesWriter);
        logger.info("objectsWriter:\n" + objectsWriter);

        List<String> array = new ArrayList<>();
        array.add(attributesWriter.toString());
        array.add(objectsWriter.toString());

        /*JsonArray attributesJson = (JsonArray) new JsonParser().parse(attributesWriter.toString());
        JsonArray objectsJson = (JsonArray) new JsonParser().parse(objectsWriter.toString());
        JsonArray jsonArray = new JsonArray();
        jsonArray.add(attributesJson);
        jsonArray.add(objectsJson);*/



        return array.toString();
    }

}
