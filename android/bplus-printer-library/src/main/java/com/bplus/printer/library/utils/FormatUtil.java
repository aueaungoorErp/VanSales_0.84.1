package com.bplus.printer.library.utils;

import java.text.DecimalFormat;

public class FormatUtil {
    public static DecimalFormat withoutDecimal = new DecimalFormat("###");
    public static DecimalFormat removeZeroDecimal = new DecimalFormat("###.#");
    public static DecimalFormat decimal2digit = new DecimalFormat("0.00");
    public static DecimalFormat decimal2digitWithCommas = new DecimalFormat("#,##0.00");
    public static DecimalFormat decimalWithoutCommas = new DecimalFormat("#,##0");

}
