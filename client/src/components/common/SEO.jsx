import { useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext';

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
}) => {
  const { settings, collegeInfo } = useCollege();

  useEffect(() => {
    const collegeName = collegeInfo?.collegeName || settings?.collegeName || 'Apex Institute of Technology & Sciences';
    const defaultTitle = settings?.defaultSeo?.metaTitle || `${collegeName} | Excellence in Education`;
    const defaultDesc = settings?.defaultSeo?.metaDescription || 'Official portal of Apex Institute of Technology & Sciences.';

    // Update document title
    document.title = title ? `${title} | ${collegeName}` : defaultTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || defaultDesc;

    // Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = keywords;
    }

    // Update OpenGraph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title ? `${title} | ${collegeName}` : defaultTitle;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = description || defaultDesc;

    if (ogImage) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement('meta');
        ogImg.setAttribute('property', 'og:image');
        document.head.appendChild(ogImg);
      }
      ogImg.content = ogImage;
    }
  }, [title, description, keywords, ogImage, settings, collegeInfo]);

  return null;
};

export default SEO;
