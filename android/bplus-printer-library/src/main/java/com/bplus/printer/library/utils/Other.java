package com.bplus.printer.library.utils;

import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.Bitmap.Config;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Typeface;
import android.os.Environment;
import android.text.Layout.Alignment;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.text.TextUtils.TruncateAt;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.EnumMap;
import java.util.Map;

import static android.graphics.Color.BLACK;
import static android.graphics.Color.WHITE;

public class Other {
    public byte[] buf;
    public int index;
    private static final int WIDTH_80 = 576;
    private static final int WIDTH_58 = 384;
    private static int[] p0 = new int[]{0, 128};
    private static int[] p1 = new int[]{0, 64};
    private static int[] p2 = new int[]{0, 32};
    private static int[] p3 = new int[]{0, 16};
    private static int[] p4 = new int[]{0, 8};
    private static int[] p5 = new int[]{0, 4};
    private static int[] p6 = new int[]{0, 2};
    private static final byte[] chartobyte = new byte[]{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 10, 11, 12, 13, 14, 15};

    public Other(int length) {
        this.buf = new byte[length];
        this.index = 0;
    }

    public static StringBuilder RemoveChar(String str, char c) {
        StringBuilder sb = new StringBuilder();
        int length = str.length();

        for(int i = 0; i < length; ++i) {
            char tmp = str.charAt(i);
            if(tmp != c) {
                sb.append(tmp);
            }
        }

        return sb;
    }

    public static boolean IsHexChar(char c) {
        return c >= 48 && c <= 57 || c >= 97 && c <= 102 || c >= 65 && c <= 70;
    }

    public static byte HexCharsToByte(char ch, char cl) {
        byte b = (byte)(chartobyte[ch - 48] << 4 & 240 | chartobyte[cl - 48] & 15);
        return b;
    }

    public static byte[] HexStringToBytes(String str) {
        int count = str.length();
        byte[] data = null;
        if(count % 2 == 0) {
            data = new byte[count / 2];

            for(int i = 0; i < count; i += 2) {
                char ch = str.charAt(i);
                char cl = str.charAt(i + 1);
                if(!IsHexChar(ch) || !IsHexChar(cl)) {
                    data = null;
                    break;
                }

                if(ch >= 97) {
                    ch = (char)(ch - 32);
                }

                if(cl >= 97) {
                    cl = (char)(cl - 32);
                }

                data[i / 2] = HexCharsToByte(ch, cl);
            }
        }

        return data;
    }

    public void UTF8ToGBK(String Data) {
        try {
            byte[] bs = Data.getBytes("GBK");
            int DataLength = bs.length;

            for(int i = 0; i < DataLength; ++i) {
                this.buf[this.index++] = bs[i];
            }
        } catch (UnsupportedEncodingException var5) {
            var5.printStackTrace();
        }

    }

    public static byte[] StringTOGBK(String data) {
        byte[] buffer = null;

        try {
            buffer = data.getBytes("GBK");
        } catch (UnsupportedEncodingException var3) {
            var3.printStackTrace();
        }

        return buffer;
    }

    public static Bitmap createAppIconText(String txt, float size, boolean is58mm, int hight, Alignment alignment, int fonStyle) {
        Bitmap canvasBitmap;
        int width;
        Canvas canvas;
        TextPaint paint;
        StaticLayout layout;
        if(is58mm) {
            canvasBitmap = Bitmap.createBitmap(384, hight, Config.ARGB_8888);
            width = canvasBitmap.getWidth();
            canvas = new Canvas(canvasBitmap);
            canvas.setBitmap(canvasBitmap);
            canvas.drawColor(-1);
            paint = new TextPaint();
            paint.setColor(-16777216);
            paint.setTextSize(size);
            paint.setAntiAlias(true);
            paint.setStyle(Style.FILL);
            paint.setFakeBoldText(false);
            paint.setTypeface(Typeface.create(Typeface.DEFAULT_BOLD, fonStyle));
            layout = new StaticLayout(txt, 0, txt.length(), paint, width, alignment, 1.1F, 0.0F, true, TruncateAt.END, width);
            canvas.translate(0.0F, 5.0F);

            layout.draw(canvas);
            canvas.save();
            canvas.restore();
            return canvasBitmap;
        } else {
            canvasBitmap = Bitmap.createBitmap(576, hight, Config.ARGB_8888);
            width = canvasBitmap.getWidth();
            canvas = new Canvas(canvasBitmap);
            canvas.setBitmap(canvasBitmap);
            canvas.drawColor(-1);
            paint = new TextPaint();
            paint.setColor(-16777216);
            paint.setTextSize(size);
            paint.setAntiAlias(true);
            paint.setStyle(Style.FILL);
            paint.setFakeBoldText(false);
            paint.setTypeface(Typeface.create(Typeface.DEFAULT_BOLD, fonStyle));
            layout = new StaticLayout(txt, 0, txt.length(), paint, width, Alignment.ALIGN_NORMAL, 1.1F, 0.0F, true, TruncateAt.END, width);
            canvas.translate(0.0F, 5.0F);
            layout.draw(canvas);
            canvas.save();
            canvas.restore();
            return canvasBitmap;
        }
    }

    public static Bitmap createAppIconTextBothBeside(String txtLeft, String txtRight, int leftWidth, int rightWidth, float size, boolean is58mm, int height, int fonStyle) {
        Bitmap canvasBitmapLeft;
        Bitmap canvasBitmapRight;
        Bitmap btm = Bitmap.createBitmap(384, height, Bitmap.Config.ARGB_8888);
        Canvas comboImage = new Canvas(btm);

        int width;
        Canvas canvas;
        TextPaint paint;
        StaticLayout layout;

        if(is58mm) {
            canvasBitmapLeft = Bitmap.createBitmap(leftWidth, height, Config.ARGB_8888);
            width = canvasBitmapLeft.getWidth();
            canvas = new Canvas(canvasBitmapLeft);
            canvas.setBitmap(canvasBitmapLeft);
            canvas.drawColor(-1);
            paint = new TextPaint();
            paint.setColor(-16777216);
            paint.setTextSize(size);
            paint.setAntiAlias(true);
            paint.setStyle(Style.FILL);
            paint.setFakeBoldText(false);
            paint.setTypeface(Typeface.create(Typeface.DEFAULT_BOLD, fonStyle));
            layout = new StaticLayout(txtLeft, 0, txtLeft.length(), paint, width, Alignment.ALIGN_NORMAL, 1.1F, 0.0F, true, TruncateAt.END, width);
            canvas.translate(0.0F, 5.0F);

            layout.draw(canvas);
            canvas.save();
            canvas.restore();

            canvasBitmapRight = Bitmap.createBitmap(rightWidth, height, Config.ARGB_8888);
            width = canvasBitmapRight.getWidth();
            canvas = new Canvas(canvasBitmapRight);
            canvas.setBitmap(canvasBitmapRight);
            canvas.drawColor(-1);
            paint = new TextPaint();
            paint.setColor(-16777216);
            paint.setTextSize(size);
            paint.setAntiAlias(true);
            paint.setStyle(Style.FILL);
            paint.setFakeBoldText(false);
            paint.setTypeface(Typeface.create(Typeface.DEFAULT_BOLD, fonStyle));
            layout = new StaticLayout(txtRight, 0, txtRight.length(), paint, width, Alignment.ALIGN_OPPOSITE, 1.1F, 0.0F, true, TruncateAt.END, width);
            canvas.translate(0.0F, 5.0F);

            layout.draw(canvas);
            canvas.save();
            canvas.restore();

            comboImage.drawBitmap(canvasBitmapLeft, 0f, 0f, null);
            comboImage.drawBitmap(canvasBitmapRight, canvasBitmapLeft.getWidth(), 0f, null);

            return btm;
        } else {
            canvasBitmapRight = Bitmap.createBitmap(576, height, Config.ARGB_8888);
//            width = canvasBitmap.getWidth();
//            canvas = new Canvas(canvasBitmap);
//            canvas.setBitmap(canvasBitmap);
//            canvas.drawColor(-1);
//            paint = new TextPaint();
//            paint.setColor(-16777216);
//            paint.setTextSize(size);
//            paint.setAntiAlias(true);
//            paint.setStyle(Style.FILL);
//            paint.setFakeBoldText(false);
//            layout = new StaticLayout(txt, 0, txt.length(), paint, width, Alignment.ALIGN_NORMAL, 1.1F, 0.0F, true, TruncateAt.END, width);
//            canvas.translate(0.0F, 5.0F);
//            layout.draw(canvas);
//            canvas.save(31);
//            canvas.restore();
            return canvasBitmapRight;
        }
    }

    public static Bitmap createAppIconTextMultiBlockInline(String[] arrTxt,
                                                           int[] arrWidth,
                                                           float[] arrSize,
                                                           boolean is58mm,
                                                           Alignment[] arrAlignment,
                                                           int fonStyle,
                                                           int includeHeight,
                                                           boolean inline,
                                                           int heightInline) {
        if(is58mm) {
            Bitmap[] canvasBitmap = new Bitmap[arrTxt.length];
            Canvas canvas;
            TextPaint paint;
            StaticLayout[] layout = new StaticLayout[arrTxt.length];
            int maxHeight = 0;

            int prevImageWidth = 0;

            for (int i = 0; i < arrTxt.length; i++) {
                paint = new TextPaint();
                paint.setColor(-16777216);
                paint.setTextSize(arrSize[i]);
                paint.setAntiAlias(true);
                paint.setStyle(Style.FILL);
                paint.setFakeBoldText(false);

                paint.setTypeface(Typeface.create(Typeface.DEFAULT_BOLD, fonStyle));
                layout[i] = new StaticLayout(arrTxt[i], 0, arrTxt[i].length(), paint, arrWidth[i], arrAlignment[i], 1.1F, 0.0F, true, TruncateAt.END, arrWidth[i]);


                maxHeight = layout[i].getHeight() > maxHeight ? layout[i].getHeight() : maxHeight;
            }

            if (inline) {
                maxHeight = heightInline;
            } else {
                maxHeight = maxHeight + includeHeight;
            }

            Bitmap btm = Bitmap.createBitmap(384, maxHeight, Bitmap.Config.ARGB_8888);
            Canvas comboImage = new Canvas(btm);

            for (int i = 0; i < arrTxt.length; i++) {
                canvasBitmap[i] = Bitmap.createBitmap(arrWidth[i], maxHeight, Config.ARGB_8888);
                canvas = new Canvas(canvasBitmap[i]);
                canvas.setBitmap(canvasBitmap[i]);
                canvas.drawColor(-1);
                canvas.translate(0.0F, 5.0F);
                layout[i].draw(canvas);
                canvas.save();
                canvas.restore();

                comboImage.drawBitmap(canvasBitmap[i], prevImageWidth, 0f, null);
                prevImageWidth = prevImageWidth + canvasBitmap[i].getWidth();

            }

            return btm;
        } else {
            Bitmap btm = Bitmap.createBitmap(384, 50, Bitmap.Config.ARGB_8888);

            return btm;
        }
    }

    public static Bitmap convertTextToBitmapMultiBlock(String[] arrTxt,
                                                       int[] arrWidth,
                                                       float fontSize,
                                                       Alignment[] arrAlignment,
                                                       Typeface typeface,
                                                       int fonStyle,
                                                       int includeHeight,
                                                       boolean inline,
                                                       int heightInline) {


        Bitmap[] canvasBitmap = new Bitmap[arrTxt.length];
        Canvas canvas;
        TextPaint paint;
        StaticLayout[] layout = new StaticLayout[arrTxt.length];
        int maxWidth = 0;
        int maxHeight = 0;

        int prevImageWidth = 0;

        for (int i = 0; i < arrTxt.length; i++) {
            paint = new TextPaint();
            paint.setColor(-16777216);
            paint.setTextSize(fontSize);
            paint.setAntiAlias(true);
            paint.setStyle(Style.FILL);
            paint.setFakeBoldText(false);

            paint.setTypeface(Typeface.create(typeface, fonStyle));

            layout[i] = new StaticLayout(arrTxt[i], 0, arrTxt[i].length(), paint, arrWidth[i], arrAlignment[i], 1.1F, 0.0F, true, TruncateAt.END, arrWidth[i]);

            maxHeight = layout[i].getHeight() > maxHeight ? layout[i].getHeight() : maxHeight;

            maxWidth += arrWidth[i];
        }

        if (inline) {
            maxHeight = heightInline;
        } else {
            maxHeight = maxHeight + includeHeight;
        }

        Bitmap btm = Bitmap.createBitmap(maxWidth, maxHeight, Bitmap.Config.ARGB_8888);
        Canvas comboImage = new Canvas(btm);

        for (int i = 0; i < arrTxt.length; i++) {
            canvasBitmap[i] = Bitmap.createBitmap(arrWidth[i], maxHeight, Config.ARGB_8888);
            canvas = new Canvas(canvasBitmap[i]);
            canvas.setBitmap(canvasBitmap[i]);
            canvas.drawColor(-1);
            canvas.translate(0.0F, 5.0F);
            layout[i].draw(canvas);
            canvas.save();
            canvas.restore();

            comboImage.drawBitmap(canvasBitmap[i], prevImageWidth, 0f, null);
            prevImageWidth = prevImageWidth + canvasBitmap[i].getWidth();
        }

        return btm;

    }

    public static byte[] byteArraysToBytes(byte[][] data) {
        int length = 0;

        for(int i = 0; i < data.length; ++i) {
            length += data[i].length;
        }

        byte[] send = new byte[length];
        int k = 0;

        for(int i = 0; i < data.length; ++i) {
            for(int j = 0; j < data[i].length; ++j) {
                send[k++] = data[i][j];
            }
        }

        return send;
    }

    public static Bitmap resizeImage(Bitmap bitmap, int w, int h) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        float scaleWidth = (float)w / (float)width;
        float scaleHeight = (float)h / (float)height;
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap resizedBitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
        return resizedBitmap;
    }

    public static Bitmap toGrayscale(Bitmap bmpOriginal) {
        int height = bmpOriginal.getHeight();
        int width = bmpOriginal.getWidth();
        Bitmap bmpGrayscale = Bitmap.createBitmap(width, height, Config.ARGB_8888);
        Canvas c = new Canvas(bmpGrayscale);
        Paint paint = new Paint();
        ColorMatrix cm = new ColorMatrix();
        cm.setSaturation(0.0F);
        ColorMatrixColorFilter f = new ColorMatrixColorFilter(cm);
        paint.setColorFilter(f);
        c.drawBitmap(bmpOriginal, 0.0F, 0.0F, paint);
        return bmpGrayscale;
    }

    public static void saveMyBitmap(Bitmap mBitmap, String name) {
        File f = new File(Environment.getExternalStorageDirectory().getPath(), name);

        try {
            f.createNewFile();
        } catch (IOException var7) {
            ;
        }

        FileOutputStream fOut = null;

        try {
            fOut = new FileOutputStream(f);
            mBitmap.compress(CompressFormat.PNG, 100, fOut);
            fOut.flush();
            fOut.close();
        } catch (FileNotFoundException var5) {
            ;
        } catch (IOException var6) {
            ;
        }

    }

    public static byte[] thresholdToBWPic(Bitmap mBitmap) {
        int[] pixels = new int[mBitmap.getWidth() * mBitmap.getHeight()];
        byte[] data = new byte[mBitmap.getWidth() * mBitmap.getHeight()];
        mBitmap.getPixels(pixels, 0, mBitmap.getWidth(), 0, 0, mBitmap.getWidth(), mBitmap.getHeight());
        format_K_threshold(pixels, mBitmap.getWidth(), mBitmap.getHeight(), data);
        return data;
    }

    private static void format_K_threshold(int[] orgpixels, int xsize, int ysize, byte[] despixels) {
        int graytotal = 0;

        int k = 0;

        int i;
        int j;
        int gray;
        for(i = 0; i < ysize; ++i) {
            for(j = 0; j < xsize; ++j) {
                gray = orgpixels[k] & 255;
                graytotal += gray;
                ++k;
            }
        }

        int grayave = graytotal / ysize / xsize;
        k = 0;

        for(i = 0; i < ysize; ++i) {
            for(j = 0; j < xsize; ++j) {
                gray = orgpixels[k] & 255;
                if(gray > grayave) {
                    despixels[k] = 0;
                } else {
                    despixels[k] = 1;
                }

                ++k;
            }
        }

    }

    public static void overWriteBitmap(Bitmap mBitmap, byte[] dithered) {
        int ysize = mBitmap.getHeight();
        int xsize = mBitmap.getWidth();
        int k = 0;

        for(int i = 0; i < ysize; ++i) {
            for(int j = 0; j < xsize; ++j) {
                if(dithered[k] == 0) {
                    mBitmap.setPixel(j, i, -1);
                } else {
                    mBitmap.setPixel(j, i, -16777216);
                }

                ++k;
            }
        }

    }

    public static byte[] eachLinePixToCmd(byte[] src, int nWidth, int nMode) {
        int nHeight = src.length / nWidth;
        int nBytesPerLine = nWidth / 8;
        byte[] data = new byte[nHeight * (8 + nBytesPerLine)];

        int k = 0;

        for(int i = 0; i < nHeight; ++i) {
            int offset = i * (8 + nBytesPerLine);
            data[offset + 0] = 29;
            data[offset + 1] = 118;
            data[offset + 2] = 48;
            data[offset + 3] = (byte)(nMode & 1);
            data[offset + 4] = (byte)(nBytesPerLine % 256);
            data[offset + 5] = (byte)(nBytesPerLine / 256);
            data[offset + 6] = 1;
            data[offset + 7] = 0;

            for(int j = 0; j < nBytesPerLine; ++j) {
                data[offset + 8 + j] = (byte)(p0[src[k]] + p1[src[k + 1]] + p2[src[k + 2]] + p3[src[k + 3]] + p4[src[k + 4]] + p5[src[k + 5]] + p6[src[k + 6]] + src[k + 7]);
                k += 8;
            }
        }

        return data;
    }

    public static Bitmap generateBarCodeToBitmap(String barcode, int barcodeType, int width, int height) {
        Bitmap barcodeBitmap = null;
        BarcodeFormat barcodeFormat = convertToZXingFormat(barcodeType);
        try
        {
            barcodeBitmap = encodeAsBitmap(barcode, barcodeFormat, width, height);
        }
        catch (WriterException e)
        {
            e.printStackTrace();
        }
        return barcodeBitmap;
    }

    public static Bitmap generateQRCodeToBitmap(String text, int size) {
        QRCodeWriter writer = new QRCodeWriter();
        Bitmap bmp = Bitmap.createBitmap(size, size, Bitmap.Config.RGB_565);

        try {
            BitMatrix bitMatrix = writer.encode(text, BarcodeFormat.QR_CODE, size, size);
            int width = bitMatrix.getWidth();
            int height = bitMatrix.getHeight();

            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    bmp.setPixel(x, y, bitMatrix.get(x, y) ? BLACK : WHITE);
                }
            }
        } catch (WriterException e) {
            e.printStackTrace();
        }

        return bmp;
    }

    private static Bitmap encodeAsBitmap(String contents, BarcodeFormat format, int img_width, int img_height) throws WriterException
    {
        if (contents == null) {
            return null;
        }
        Map<EncodeHintType, Object> hints = null;
        String encoding = guessAppropriateEncoding(contents);
        if (encoding != null) {
            hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.CHARACTER_SET, encoding);
        }
        MultiFormatWriter writer = new MultiFormatWriter();
        BitMatrix result;
        try {
            result = writer.encode(contents, format, img_width, img_height, hints);
        } catch (IllegalArgumentException iae) {
            // Unsupported format
            return null;
        }
        int width = result.getWidth();
        int height = result.getHeight();
        int[] pixels = new int[width * height];
        for (int y = 0; y < height; y++) {
            int offset = y * width;
            for (int x = 0; x < width; x++) {
                pixels[offset + x] = result.get(x, y) ? BLACK : WHITE;
            }
        }

        Bitmap bitmap = Bitmap.createBitmap(width, height,
                Bitmap.Config.ARGB_8888);
        bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
        return bitmap;
    }

    private static String guessAppropriateEncoding(CharSequence contents) {
        // Very crude at the moment
        for (int i = 0; i < contents.length(); i++) {
            if (contents.charAt(i) > 0xFF) {
                return "UTF-8";
            }
        }
        return null;
    }

    private static BarcodeFormat convertToZXingFormat(int format)
    {
        switch (format)
        {
            case 8:
                return BarcodeFormat.CODABAR;
            case 1:
                return BarcodeFormat.CODE_128;
            case 2:
                return BarcodeFormat.CODE_39;
            case 4:
                return BarcodeFormat.CODE_93;
            case 32:
                return BarcodeFormat.EAN_13;
            case 64:
                return BarcodeFormat.EAN_8;
            case 128:
                return BarcodeFormat.ITF;
            case 512:
                return BarcodeFormat.UPC_A;
            case 1024:
                return BarcodeFormat.UPC_E;
            //default 128?
            default:
                return BarcodeFormat.CODE_128;
        }
    }

}
