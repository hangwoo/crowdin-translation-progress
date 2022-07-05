# crowdin api 를 이용한 진행률 체크 github-action

## 사용법 Usage

```yaml
 - name: Crowdin translation progress
   uses: hangwoo/crowdin-translation-progress@v1.0.0
   with:
     access_token: ACCESS_TOKEN # use github secret
     languages: 'ja'
     project_id: '392841'
     branch_id: '113' // optional
     target_progress: '100' # optional. default 100
```
