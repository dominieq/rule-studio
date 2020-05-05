package pl.put.poznan.rulestudio.model;

import org.springframework.core.io.Resource;

public class NamedResource {
    public String name;
    public Resource resource;

    public NamedResource(String name, Resource resource) {
        this.name = name;
        this.resource = resource;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }
}
