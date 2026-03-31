package com.bplus.bluetooth.finder.library.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Bluetooth {
    @SerializedName("name")
    @Expose
    private String name;

    @SerializedName("address")
    @Expose
    private String address;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Bluetooth(String name, String address) {
        this.name = name;
        this.address = address;
    }
}
