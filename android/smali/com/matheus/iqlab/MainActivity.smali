.class public Lcom/matheus/iqlab/MainActivity;
.super Landroid/app/Activity;

.field private web:Landroid/webkit/WebView;

.method public constructor <init>()V
    .locals 0
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 5
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V
    const v1, -0xe2dfdb
    new-instance v2, Landroid/webkit/WebView;
    invoke-direct {v2, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V
    iput-object v2, p0, Lcom/matheus/iqlab/MainActivity;->web:Landroid/webkit/WebView;
    invoke-virtual {v2, v1}, Landroid/webkit/WebView;->setBackgroundColor(I)V
    invoke-virtual {v2}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
    move-result-object v3
    const/4 v4, 0x1
    invoke-virtual {v3, v4}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V
    invoke-virtual {v3, v4}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V
    const/16 v4, 0x64
    invoke-virtual {v3, v4}, Landroid/webkit/WebSettings;->setTextZoom(I)V
    invoke-virtual {p0, v2}, Landroid/app/Activity;->setContentView(Landroid/view/View;)V
    const-string v4, "file:///android_asset/index.html"
    invoke-virtual {v2, v4}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    return-void
.end method

.method public onBackPressed()V
    .locals 1
    const/4 v0, 0x1
    invoke-virtual {p0, v0}, Landroid/app/Activity;->moveTaskToBack(Z)Z
    return-void
.end method
