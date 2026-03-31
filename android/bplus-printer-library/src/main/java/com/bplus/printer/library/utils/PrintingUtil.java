package com.bplus.printer.library.utils;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.text.TextUtils;
import android.util.Log;

import com.bplus.printer.library.constant.PrinterConst;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by tanagorn on 12/3/2561.
 */

public class PrintingUtil {
    // UNICODE 0x23 = #
    public static final byte[] UNICODE_TEXT = new byte[] { 0x23, 0x23, 0x23,
            0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23,
            0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23, 0x23,
            0x23, 0x23, 0x23 };

    private static String hexStr = "0123456789ABCDEF";
    private static String[] binaryArray = { "0000", "0001", "0010", "0011",
            "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011",
            "1100", "1101", "1110", "1111" };

    private static int _lineHeight = 35;

    private static boolean _textBold = false;

    public static void setTextBold(boolean bold) {
        _textBold = bold;
    }

    public static String convertText(String text, int limit, int side) {
        int length = text.length();

        if (length > limit) {
            text = text.substring(0, limit - 1);
        } else {
            for (int i = 0; i < (limit - length); i++) {
                if (side == 1) {
                    text = " " + text;
                } else {
                    text = text + " ";
                }
            }
        }

        return text;
    }

    public static String setFormatStringForPrinting(String text, int limit, int align) {
        int length = 0;
        String newStr = "";
        for (int i = 0; i < text.length(); i++) {
            char character = text.charAt(i);
            int ascii = (int) character;
            if (!(ascii == 3633 || (ascii >= 3636 && ascii <= 3642) || (ascii >= 3655 && ascii <= 3662))) {
                length++;
            }
            if (length <= limit) {
                newStr = newStr + character;
            }
        }

        if (length > limit) {
            newStr = newStr.substring(0, limit - 1);
        } else {
            int space = limit - length;
            for (int i = 0; i < (space); i++) {
                if (align == PrinterConst.ALIGN_RIGHT) {
                    newStr = " " + newStr;
                } else if (align == PrinterConst.ALIGN_LEFT) {
                    newStr = newStr + " ";
                }
            }
        }

        return newStr;
    }

    public static String thaiR(String text, int limit) {
        int count = 0;
        String newStr = "";
        for (int i = 0; i < text.length(); i++) {
            char character = text.charAt(i);
            int ascii = (int) character;
            if (!(ascii == 3633 || (ascii >= 3636 && ascii <= 3642) || (ascii >= 3655 && ascii <= 3662))) {
                count++;
            }
            if (count <= limit) {
                newStr = newStr + character;
            }
        }

        for (int i = 0; i < (limit - count); i++) {
            newStr = newStr + " ";
        }

        return newStr;
    }

    public static int countThaiR(String text) {
        int count = 0;

        for (int i = 0; i < text.length(); i++) {
            char character = text.charAt(i);
            int ascii = (int) character;
            if (!(ascii == 3633 || (ascii >= 3636 && ascii <= 3642) || (ascii >= 3655 && ascii <= 3662))) {
                count++;
            }
        }

        return count;
    }

    public static String convertReal(String str) {
        String TempStr = "";

        if (str.indexOf(",") > 0) {
            for (int i = 0; i < str.length(); i++) {
                char ch = str.charAt(i);
                String strCh = "";
                strCh = strCh + ch;
                if (!strCh.equals(",")) {
                    TempStr = TempStr + strCh;
                }
            }
        } else {
            TempStr = str;
        }

        return TempStr;
    }

    public static byte[] decodeBitmap(Bitmap bmp) {
        int bmpWidth = bmp.getWidth();
        int bmpHeight = bmp.getHeight();

        List<String> list = new ArrayList<String>(); // binaryString list
        StringBuffer sb;

        int bitLen = bmpWidth / 8;
        int zeroCount = bmpWidth % 8;

        String zeroStr = "";
        if (zeroCount > 0) {
            bitLen = bmpWidth / 8 + 1;
            for (int i = 0; i < (8 - zeroCount); i++) {
                zeroStr = zeroStr + "0";
            }
        }

        for (int i = 0; i < bmpHeight; i++) {
            sb = new StringBuffer();
            for (int j = 0; j < bmpWidth; j++) {
                int color = bmp.getPixel(j, i);

                int r = (color >> 16) & 0xff;
                int g = (color >> 8) & 0xff;
                int b = color & 0xff;

                // if color close to white，bit='0', else bit='1'
                if (r > 160 && g > 160 && b > 160)
                    sb.append("0");
                else
                    sb.append("1");
            }
            if (zeroCount > 0) {
                sb.append(zeroStr);
            }
            list.add(sb.toString());
        }

        List<String> bmpHexList = binaryListToHexStringList(list);
        String commandHexString = "1D763000";
        String widthHexString = Integer
                .toHexString(bmpWidth % 8 == 0 ? bmpWidth / 8
                        : (bmpWidth / 8 + 1));
        if (widthHexString.length() > 2) {
            Log.e("decodeBitmap error", " width is too large");
            // return null;
        } else if (widthHexString.length() == 1) {
            widthHexString = "0" + widthHexString;
        }
        widthHexString = widthHexString + "00";

        String heightHexString = Integer.toHexString(bmpHeight);
        if (heightHexString.length() > 2) {
            Log.e("decodeBitmap error", " height is too large");
            // return null;
        } else if (heightHexString.length() == 1) {
            heightHexString = "0" + heightHexString;
        }
        heightHexString = heightHexString + "00";

        List<String> commandList = new ArrayList<String>();
        commandList.add(commandHexString + widthHexString + heightHexString);
        commandList.addAll(bmpHexList);

        return hexList2Byte(commandList);
    }

    public static List<String> binaryListToHexStringList(List<String> list) {
        List<String> hexList = new ArrayList<String>();
        for (String binaryStr : list) {
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < binaryStr.length(); i += 8) {
                String str = binaryStr.substring(i, i + 8);

                String hexString = myBinaryStrToHexString(str);
                sb.append(hexString);
            }
            hexList.add(sb.toString());
        }
        return hexList;

    }

    public static String myBinaryStrToHexString(String binaryStr) {
        String hex = "";
        String f4 = binaryStr.substring(0, 4);
        String b4 = binaryStr.substring(4, 8);
        for (int i = 0; i < binaryArray.length; i++) {
            if (f4.equals(binaryArray[i]))
                hex += hexStr.substring(i, i + 1);
        }
        for (int i = 0; i < binaryArray.length; i++) {
            if (b4.equals(binaryArray[i]))
                hex += hexStr.substring(i, i + 1);
        }

        return hex;
    }

    public static byte[] hexList2Byte(List<String> list) {
        List<byte[]> commandList = new ArrayList<byte[]>();

        for (String hexStr : list) {
            commandList.add(hexStringToBytes(hexStr));
        }
        byte[] bytes = sysCopy(commandList);
        return bytes;
    }

    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
        }
        return d;
    }

    public static byte[] sysCopy(List<byte[]> srcArrays) {
        int len = 0;
        for (byte[] srcArray : srcArrays) {
            len += srcArray.length;
        }
        byte[] destArray = new byte[len];
        int destLen = 0;
        for (byte[] srcArray : srcArrays) {
            System.arraycopy(srcArray, 0, destArray, destLen, srcArray.length);
            destLen += srcArray.length;
        }
        return destArray;
    }

    private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }

    public static Bitmap scaleBitmap(Bitmap bm) {
        int maxWidth = 100;
        int maxHeight = 100;
        int width = bm.getWidth();
        int height = bm.getHeight();

        Log.i("Pictures", "Width and height are " + width + "--" + height);

        if (width > height) {
            // landscape
            float ratio = (float) width / maxWidth;
            width = maxWidth;
            height = (int) (height / ratio);
        } else if (height > width) {
            // portrait
            float ratio = (float) height / maxHeight;
            height = maxHeight;
            width = (int) (width / ratio);
        } else {
            // square
            height = maxHeight;
            width = maxWidth;
        }

        Log.i("Pictures", "after scaling Width and height are " + width + "--" + height);

        bm = Bitmap.createScaledBitmap(bm, width, height, true);
        return bm;
    }

    public static String getDateTime() {
        Calendar c = Calendar.getInstance();
        SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        String date = df.format(c.getTime());

        return date;
    }

    public static String convertStrDateToPatternDateThaiYear(String dateStr, String oldDattern, String newPattern) {
        try {
            DateFormat oldPt = new SimpleDateFormat(oldDattern);
            DateFormat newPt = new SimpleDateFormat(newPattern);
            Date newDate = null;

            newDate = oldPt.parse(dateStr);
            Calendar calender = Calendar.getInstance();
            calender.setTime(newDate);
            calender.add(Calendar.YEAR, 543);

            return newPt.format(calender.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
            return "";
        }
    }

    public static Bitmap formattingPrinterGraphicMode(int paperWidth, Bitmap line, String text, double position,
            int align) {
        int textWidth = getTextWidth(text);
        Float pt = findPosition(paperWidth, (float) position - 1, align, textWidth);

        if (line == null) {
            line = Bitmap.createBitmap(paperWidth, _lineHeight, Bitmap.Config.ARGB_8888);
            createCanvas(line, "", paperWidth);
        }

        Bitmap canvasBitmap = Bitmap.createBitmap(textWidth, _lineHeight, Bitmap.Config.ARGB_8888);
        createCanvas(canvasBitmap, text, paperWidth);

        Canvas comboImage = new Canvas(line);
        comboImage.drawBitmap(line, 0f, 0f, null);
        comboImage.drawBitmap(canvasBitmap, pt, 0f, null);

        return line;
    }

    public static Bitmap formattingPrinterGraphicModeOutLine(int paperWidth, String text, double position, int align) {
        Layout.Alignment alignment = null;

        if (align == PrinterConst.ALIGN_LEFT) {
            alignment = Layout.Alignment.ALIGN_NORMAL;
        } else if (align == PrinterConst.ALIGN_CENTER) {
            alignment = Layout.Alignment.ALIGN_CENTER;
        } else if (align == PrinterConst.ALIGN_RIGHT) {
            alignment = Layout.Alignment.ALIGN_OPPOSITE;
        }

        TextPaint paint = createTextPaint(23);

        StaticLayout layout = new StaticLayout(text, 0, text.length(), paint, paperWidth, alignment, 1.1F, 0.0F, true,
                TextUtils.TruncateAt.END, paperWidth);

        int textHeight = layout.getHeight() + 5;

        Bitmap canvasBitmap = Bitmap.createBitmap(paperWidth, textHeight, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(canvasBitmap);
        canvas.setBitmap(canvasBitmap);
        canvas.drawColor(-1);
        canvas.translate(0.0F, 5.0F);
        layout.draw(canvas);
        canvas.save();
        canvas.restore();

        return canvasBitmap;
    }

    private static Canvas createCanvas(Bitmap btm, String text, int paperWidth) {
        StaticLayout layout = createStaticLayout(text, paperWidth);

        Canvas canvas = new Canvas(btm);
        canvas.setBitmap(btm);
        canvas.drawColor(-1);
        canvas.translate(0.0F, 5.0F);
        layout.draw(canvas);
        canvas.save();
        canvas.restore();

        return canvas;
    }

    private static StaticLayout createStaticLayout(String text, int paperWidth) {
        TextPaint paint = createTextPaint(23);

        return new StaticLayout(
                text,
                0, text.length(),
                paint,
                paperWidth,
                Layout.Alignment.ALIGN_NORMAL,
                1.1F,
                0.0F,
                true,
                TextUtils.TruncateAt.END,
                paperWidth);
    }

    private static TextPaint createTextPaint(int textSize) {
        TextPaint paint = new TextPaint();
        paint.setColor(-16777216);
        paint.setTextSize(textSize);
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.FILL);
        paint.setFakeBoldText(false);

        paint.setTypeface(Typeface.create(_textBold ? Typeface.DEFAULT_BOLD : Typeface.DEFAULT,
                _textBold ? Typeface.BOLD : Typeface.NORMAL));

        return paint;
    }

    private static int getTextWidth(String text) {
        Rect bounds = new Rect();
        TextPaint paint = createTextPaint(23);
        paint.getTextBounds(text, 0, text.length(), bounds);

        return bounds.width();
    }

    private static int getTextHeight(String text, int align, int width) {
        Rect bounds = new Rect();
        TextPaint paint = createTextPaint(23);

        Layout.Alignment alignment = null;

        if (align == PrinterConst.ALIGN_LEFT) {
            alignment = Layout.Alignment.ALIGN_NORMAL;
        } else if (align == PrinterConst.ALIGN_CENTER) {
            alignment = Layout.Alignment.ALIGN_CENTER;
        } else if (align == PrinterConst.ALIGN_RIGHT) {
            alignment = Layout.Alignment.ALIGN_OPPOSITE;
        }

        StaticLayout layout = new StaticLayout(text, 0, text.length(), paint, width, alignment, 1.1F, 0.0F, true,
                TextUtils.TruncateAt.END, width);

        return layout.getHeight();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public static String formattingPrinter(int paperWidth, int characterSize, String line, String text, double position,
            int align) {
        int pt = findPosition(paperWidth, characterSize, position);
        return replaceWordInString(line, text, align, pt, characterSize);
    }

    public static String replaceWordInString(String textLine, String word, int align, int position, int characterSize) {
        String newTextLine = "";
        int textLineLength = countStringInoreThaiSpecialCharacter(textLine);
        int wordLength = countStringInoreThaiSpecialCharacter(word);
        int beginPosition = 0;
        int endPosition = 0;
        int cutOffPosition = 0;
        if (textLine == null && textLine.length() == 0) {
            for (int i = 0; i < characterSize; i++) {
                textLine += " ";
            }
        } else if (textLineLength < characterSize) {
            for (int i = textLineLength; i < characterSize; i++) {
                textLine += " ";
            }
        }

        if (align == PrinterConst.ALIGN_LEFT) {
            beginPosition = countStringRealPositionThaiSpecialCharacter(textLine, position,
                    PrinterConst.COUNT_STRING_TYPE_1, characterSize);

            newTextLine = textLine.substring(0, beginPosition) + word;

            endPosition = countStringRealPositionThaiSpecialCharacter(textLine,
                    countStringInoreThaiSpecialCharacter(newTextLine), PrinterConst.COUNT_STRING_TYPE_1, characterSize);

            newTextLine = newTextLine + textLine.substring(endPosition, textLine.length());

            cutOffPosition = countStringRealPositionThaiSpecialCharacter(newTextLine, characterSize,
                    PrinterConst.COUNT_STRING_TYPE_2, characterSize);

            newTextLine = newTextLine.substring(0, cutOffPosition + 1);

        } else if (align == PrinterConst.ALIGN_RIGHT) {
            beginPosition = countStringRealPositionThaiSpecialCharacter(textLine, position,
                    PrinterConst.COUNT_STRING_TYPE_1, characterSize) + 1;

            newTextLine = word + textLine.substring(beginPosition, textLine.length());

            if (wordLength > position) {
                endPosition = countStringInoreThaiSpecialCharacter(newTextLine)
                        - countStringInoreThaiSpecialCharacter(textLine);
                cutOffPosition = countStringRealPositionThaiSpecialCharacter(newTextLine, endPosition,
                        PrinterConst.COUNT_STRING_TYPE_2, characterSize) + 1;
                newTextLine = newTextLine.substring(cutOffPosition, newTextLine.length());

            } else {
                int countStr = countStringInoreThaiSpecialCharacter(newTextLine);
                if (characterSize > countStr) {
                    endPosition = countStringRealPositionThaiSpecialCharacter(textLine, characterSize - countStr,
                            PrinterConst.COUNT_STRING_TYPE_2, characterSize) + 1;
                } else {
                    endPosition = countStringRealPositionThaiSpecialCharacter(textLine, characterSize - countStr,
                            PrinterConst.COUNT_STRING_TYPE_2, characterSize);
                }

                newTextLine = textLine.substring(0, endPosition) + newTextLine;
            }
        } else if (align == PrinterConst.ALIGN_CENTER) {
            int mod = wordLength % 2;
            int subPosition = (wordLength / 2) + mod;
            int leftPosition = (position - subPosition) + 1;

            if (leftPosition < 0) {
                leftPosition = (position - subPosition);

                beginPosition = countStringRealPositionThaiSpecialCharacter(word, leftPosition * -1,
                        PrinterConst.COUNT_STRING_TYPE_1, characterSize) + 1;
                word = word.substring(beginPosition, word.length());
            }

            beginPosition = countStringRealPositionThaiSpecialCharacter(textLine, leftPosition,
                    PrinterConst.COUNT_STRING_TYPE_1, characterSize);

            newTextLine = textLine.substring(0, beginPosition) + word;

            endPosition = countStringRealPositionThaiSpecialCharacter(textLine,
                    countStringInoreThaiSpecialCharacter(newTextLine), PrinterConst.COUNT_STRING_TYPE_1, characterSize);

            newTextLine = newTextLine + textLine.substring(endPosition, textLine.length());

            cutOffPosition = countStringRealPositionThaiSpecialCharacter(newTextLine, characterSize,
                    PrinterConst.COUNT_STRING_TYPE_2, characterSize);

            newTextLine = newTextLine.substring(0, cutOffPosition + 1);

        }

        return newTextLine;
    }

    public static int countStringRealPositionThaiSpecialCharacter(String text, int position, int countType,
            int characterSize) {
        int count = 0;
        int realPosition = 0;
        boolean getPosition = false;

        if (0 < position && position <= characterSize) {
            for (int i = 0; i < text.length(); i++) {
                char character = text.charAt(i);
                int ascii = (int) character;

                if (!(ascii == 3633 || (ascii >= 3636 && ascii <= 3642) || (ascii >= 3655 && ascii <= 3662))) {
                    count++;

                    if (getPosition) {
                        realPosition = i - 1;
                        break;
                    }

                    if (position == count) {
                        if (countType == PrinterConst.COUNT_STRING_TYPE_1) {
                            realPosition = i;
                            break;

                        } else if (countType == PrinterConst.COUNT_STRING_TYPE_2) {
                            getPosition = true;
                        }
                    }
                }

                if (i == text.length() - 1) {
                    realPosition = i;
                }

            }
        }

        return realPosition;
    }

    public static int countStringInoreThaiSpecialCharacter(String text) {
        int count = 0;

        for (int i = 0; i < text.length(); i++) {
            char character = text.charAt(i);
            int ascii = (int) character;
            if (!(ascii == 3633 || (ascii >= 3636 && ascii <= 3642) || (ascii >= 3655 && ascii <= 3662))) {
                count++;
            }
        }

        return count;
    }

    public static int findPosition(int width, int size, double position) {
        double ptd = (width * position / 100);

        double ptdPercent = ptd / width * 100;

        double ptiDouble = size * ptdPercent / 100;
        int pti = (int) (size * ptdPercent / 100);

        if (ptiDouble - pti > 0.5f) {
            pti = pti + 1;
        }

        if (pti == 0) {
            pti = 1;
        }

        return pti;
    }

    public static float findPosition(int width, float position) {
        return findPosition(width, position, PrinterConst.ALIGN_RIGHT, 0);
    }

    public static float findPosition(int width, float position, int align, int textWidth) {
        float pt = (width * position / 100);

        if (align == PrinterConst.ALIGN_RIGHT) {
            pt = pt - textWidth;
        } else if (align == PrinterConst.ALIGN_CENTER) {
            pt = pt - (textWidth / 2);
        }

        return pt;
    }

    private static Layout.Alignment convertToAlignFormat(int format) {
        switch (format) {
            case PrinterConst.ALIGN_LEFT:
                return Layout.Alignment.ALIGN_NORMAL;
            case PrinterConst.ALIGN_CENTER:
                return Layout.Alignment.ALIGN_CENTER;
            case PrinterConst.ALIGN_RIGHT:
                return Layout.Alignment.ALIGN_OPPOSITE;
            // default 128?
            default:
                return Layout.Alignment.ALIGN_NORMAL;
        }
    }
}
