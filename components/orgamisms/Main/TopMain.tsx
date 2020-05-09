import React from 'react';
import Link from 'next/link';

export const TopMain: React.FC = () => {
  return (
    <>
      <main>
        <h2>使い方</h2>
        <article>
          <h3>1. モデルを読み込む</h3>
          <p>
            <Link href="/model">
              <a>モデル</a>
            </Link>
            ページへ移動し、モデルデータを読み込みます。
            <br />※ MMDモデルに対応しています。
          </p>
        </article>

        <article>
          <h3>2. ページ間の接続設定をする</h3>
          <p>
            新規タブ(or 別ブラウザ)を開いて
            <Link href="/cpanel">
              <a>操作パネル</a>
            </Link>
            ページに移動します。「コネクトキーを生成する」ボタンからコネクトキーを取得します。
          </p>
          <p>
            取得したコネクトキーをモデルページのフォームに入力するとリターンキーが生成されます。生成されたリターンキーは操作パネルページのフォームに入力します。
          </p>
          <p>
            操作パネルページとモデルページの接続が確立されると、接続ステータスが「接続中」になります。
          </p>
        </article>

        <article>
          <h3>3. webカメラを起動する</h3>
          <p>
            操作パネルページの「カメラ起動」ボタンからカメラを起動します。フェイストラッキングに連動してモデルが動きます。
          </p>
        </article>
      </main>
      <style jsx>{`
        main {
          margin: 0 auto;
          padding: 1em 0;
          width: 100%;
          max-width: 800px;
          line-height: 1.8;
          box-sizing: border-box;
        }

        h2 {
          font-weight: normal;
        }

        article {
          margin: 0 0 80px;
        }

        @media (max-width: 879px) {
          main {
            padding: 0 1em;
          }
        }
      `}</style>
    </>
  );
};
